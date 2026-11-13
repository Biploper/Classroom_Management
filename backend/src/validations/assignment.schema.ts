import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().max(2000).nullable().optional(),
  due_date: z.coerce.date().nullable().optional(),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();