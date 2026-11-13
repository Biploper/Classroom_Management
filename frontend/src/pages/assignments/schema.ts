import { z } from 'zod'

export const assignmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be 120 characters or fewer'),
  description: z.string().max(2000, 'Description must be 2000 characters or fewer'),
  due_date: z.string(),
})

export type AssignmentFormValues = z.infer<typeof assignmentSchema>

// Form values -> what the API expects
export const toPayload = (values: AssignmentFormValues) => ({
  title: values.title.trim(),
  description: values.description.trim() || null,
  due_date: values.due_date ? new Date(values.due_date).toISOString() : null,
})