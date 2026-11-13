import type { Request, Response } from "express";
import { and, asc, desc, eq, ilike, isNull, ne, sql, type SQL } from "drizzle-orm";
import { db } from "../db/client.js";
import { assignments } from "../db/schemas/assignment_schema.js";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "../validations/assignment.schema.js";

// Only these columns can be sorted on (never pass user input straight to SQL)
const findDuplicate = async (
  title: string,
  dueDate: Date | null | undefined,
  excludeId?: number,
) => {
  const conditions: SQL[] = [
    sql`lower(${assignments.title}) = lower(${title.trim()})`,
    dueDate ? eq(assignments.due_date, dueDate) : isNull(assignments.due_date),
  ];
  if (excludeId) conditions.push(ne(assignments.id, excludeId));

  const [row] = await db
    .select({ id: assignments.id })
    .from(assignments)
    .where(and(...conditions))
    .limit(1);

  return Boolean(row);
};

const DUPLICATE_MESSAGE =
  "An assignment with this title and due date already exists.";

const SORTABLE = {
  id: assignments.id,
  title: assignments.title,
  due_date: assignments.due_date,
  created_at: assignments.created_at,
} as const;

const parseId = (raw: string) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const serverError = (res: Response, error: unknown) => {
  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

// GET /api/assignments?_start=0&_end=10&_sort=created_at&_order=desc&title_like=math
const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const start = Math.max(Number(req.query._start) || 0, 0);
    const end = Number(req.query._end) || start + 10;
    const limit = Math.min(Math.max(end - start, 1), 100);

    const sortKey = String(req.query._sort ?? "created_at") as keyof typeof SORTABLE;
    const sortCol = SORTABLE[sortKey] ?? SORTABLE.created_at;
    const isAsc = String(req.query._order ?? "desc").toLowerCase() === "asc";

    const search = String(req.query.title_like ?? "").trim();
    const conditions: SQL[] = [];
    if (search) {
      // escape LIKE wildcards so "50%" is searched literally
      conditions.push(ilike(assignments.title, `%${search.replace(/[\\%_]/g, "\\$&")}%`));
    }
    const where = conditions.length ? and(...conditions) : undefined;

    // nulls last, so "no deadline" rows don't jump to the top when sorting by due date
    const orderBy =
      sortCol === assignments.due_date
        ? isAsc
          ? sql`${sortCol} asc nulls last`
          : sql`${sortCol} desc nulls last`
        : isAsc
          ? asc(sortCol)
          : desc(sortCol);

    const [rows, [{ count }]] = await Promise.all([
      db.select().from(assignments).where(where).orderBy(orderBy, desc(assignments.id)).limit(limit).offset(start),
      db.select({ count: sql<number>`count(*)::int` }).from(assignments).where(where),
    ]);

    res.setHeader("X-Total-Count", String(count));
    return res.status(200).json(rows); // plain array, which is what Refine expects
  } catch (error) {
    return serverError(res, error);
  }
};

// GET /api/assignments/stats
const getAssignmentStats = async (_req: Request, res: Response) => {
  try {
    const [stats] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pastDue: sql<number>`(count(*) filter (where ${assignments.due_date} < now()))::int`,
        dueSoon: sql<number>`(count(*) filter (
          where ${assignments.due_date} >= now()
          and ${assignments.due_date} <= now() + interval '3 days'
        ))::int`,
        noDeadline: sql<number>`(count(*) filter (where ${assignments.due_date} is null))::int`,
      })
      .from(assignments);

    return res.status(200).json(stats);
  } catch (error) {
    return serverError(res, error);
  }
};

// GET /api/assignments/:id
const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const [row] = await db.select().from(assignments).where(eq(assignments.id, id));
    if (!row) return res.status(404).json({ message: "Assignment not found" });

    return res.status(200).json(row);
  } catch (error) {
    return serverError(res, error);
  }
};

// POST /api/assignments
const createAssignment = async (req: Request, res: Response) => {
  try {
    const parsed = createAssignmentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    if (await findDuplicate(parsed.data.title, parsed.data.due_date)) {
  return res.status(409).json({ message: DUPLICATE_MESSAGE });
}

    const [created] = await db.insert(assignments).values(parsed.data).returning();
    return res.status(201).json(created); // single object, not an array
  } catch (error) {
    return serverError(res, error);
  }
};

// PATCH /api/assignments/:id
const updateAssignment = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const parsed = updateAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }
    if (Object.keys(parsed.data).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    const [existing] = await db.select().from(assignments).where(eq(assignments.id, id));
if (!existing) return res.status(404).json({ message: "Assignment not found" });

const nextTitle = parsed.data.title ?? existing.title;
const nextDue = "due_date" in parsed.data ? parsed.data.due_date : existing.due_date;

if (await findDuplicate(nextTitle, nextDue, id)) {
  return res.status(409).json({ message: DUPLICATE_MESSAGE });
}

    const [updated] = await db
      .update(assignments)
      .set(parsed.data)
      .where(eq(assignments.id, id))
      .returning();

    if (!updated) return res.status(404).json({ message: "Assignment not found" });
    return res.status(200).json(updated);
  } catch (error) {
    return serverError(res, error);
  }
};

// DELETE /api/assignments/:id
const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const [deleted] = await db.delete(assignments).where(eq(assignments.id, id)).returning();
    if (!deleted) return res.status(404).json({ message: "Assignment not found" });

    return res.status(200).json(deleted);
  } catch (error) {
    return serverError(res, error);
  }
};

export default {
  getAllAssignments,
  getAssignmentStats,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};