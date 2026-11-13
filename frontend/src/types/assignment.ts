export interface Assignment {
  id: number
  title: string
  description: string | null
  due_date: string | null
  created_at: string
}

export type AssignmentModalState =
  | { mode: 'create' }
  | { mode: 'edit'; assignment: Assignment }
  | { mode: 'show'; assignment: Assignment }
  | null

export interface AssignmentStats {
  total: number
  pastDue: number
  dueSoon: number
  noDeadline: number
}