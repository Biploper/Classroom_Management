import { pgTable, integer, text, timestamp,  } from "drizzle-orm/pg-core";

export const assignments = pgTable("assignments", {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    title: text('title').notNull(),
    description: text('description'),
    due_date: timestamp("due_date", {withTimezone: true, mode: "date"}),
    created_at: timestamp("created_at", {withTimezone: true, mode: "date"}).defaultNow().notNull()
})