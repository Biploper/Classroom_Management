import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getAssignmentStatus, type AssignmentStatus } from '@/lib/assignment-status'

const STATUS_STYLES: Record<AssignmentStatus, { label: string; className: string }> = {
  upcoming: { label: 'Upcoming', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  'due-soon': { label: 'Due soon', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  'past-due': { label: 'Past due', className: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
  'no-deadline': { label: 'No deadline', className: 'bg-muted text-muted-foreground' },
}

const AssignmentStatusBadge = ({ dueDate }: { dueDate: string | null }) => {
  const { label, className } = STATUS_STYLES[getAssignmentStatus(dueDate)]
  return (
    <Badge variant='outline' className={cn('whitespace-nowrap font-medium', className)}>
      {label}
    </Badge>
  )
}

export default AssignmentStatusBadge