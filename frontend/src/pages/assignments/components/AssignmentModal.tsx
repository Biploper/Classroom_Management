import type { ElementType } from 'react'
import { useCreate, useUpdate } from '@refinedev/core'
import { CalendarClock, CalendarPlus, FilePlus2, Pencil, SquarePen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDateTime, toDateTimeLocal } from '@/lib/assignment-status'
import type { Assignment, AssignmentModalState } from '@/types/assignment'
import { toPayload, type AssignmentFormValues } from '../schema'
import AssignmentForm from './AssignmentForm'
import AssignmentStatusBadge from './AssignmentStatusBadge'

interface AssignmentModalProps {
  state: AssignmentModalState
  onClose: () => void
  onEdit: (assignment: Assignment) => void
}

const AssignmentModal = ({ state, onClose, onEdit }: AssignmentModalProps) => (
  <Dialog open={state !== null} onOpenChange={(open) => !open && onClose()}>
    <DialogContent className='max-h-[90dvh] overflow-y-auto sm:max-w-lg'>
      {state?.mode === 'create' && <CreateContent onClose={onClose} />}
      {state?.mode === 'edit' && (
        <EditContent key={state.assignment.id} assignment={state.assignment} onClose={onClose} />
      )}
      {state?.mode === 'show' && <ShowContent assignment={state.assignment} onClose={onClose} onEdit={onEdit} />}
    </DialogContent>
  </Dialog>
)

const IconBadge = ({ icon: Icon, className }: { icon: ElementType; className: string }) => (
  <div className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl ${className}`}>
    <Icon className='h-5 w-5' />
  </div>
)

const CreateContent = ({ onClose }: { onClose: () => void }) => {
  const { mutateAsync: create } = useCreate()

  const handleSubmit = async (values: AssignmentFormValues) => {
    try {
      await create({ resource: 'assignments', values: toPayload(values) })
      onClose()
    } catch {
      // Refine shows the error toast; keep the modal open so nothing typed is lost
    }
  }

  return (
    <>
      <DialogHeader>
        <IconBadge icon={FilePlus2} className='bg-primary/10 text-primary' />
        <DialogTitle>Create assignment</DialogTitle>
        <DialogDescription>Add a new assignment for your students.</DialogDescription>
      </DialogHeader>
      <AssignmentForm submitLabel='Create assignment' onSubmit={handleSubmit} onCancel={onClose} />
    </>
  )
}

const EditContent = ({ assignment, onClose }: { assignment: Assignment; onClose: () => void }) => {
  const { mutateAsync: update } = useUpdate()

  const handleSubmit = async (values: AssignmentFormValues) => {
    try {
      await update({ resource: 'assignments', id: assignment.id, values: toPayload(values) })
      onClose()
    } catch {
      // Refine shows the error toast
    }
  }

  return (
    <>
      <DialogHeader>
        <IconBadge icon={SquarePen} className='bg-amber-500/10 text-amber-600' />
        <DialogTitle>Edit assignment</DialogTitle>
        <DialogDescription>Update the details below and save your changes.</DialogDescription>
      </DialogHeader>
      <AssignmentForm
        defaultValues={{
          title: assignment.title,
          description: assignment.description ?? '',
          due_date: toDateTimeLocal(assignment.due_date),
        }}
        submitLabel='Save changes'
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </>
  )
}

const ShowContent = ({
  assignment,
  onClose,
  onEdit,
}: {
  assignment: Assignment
  onClose: () => void
  onEdit: (assignment: Assignment) => void
}) => (
  <>
    <DialogHeader>
      <div className='mb-1'>
        <AssignmentStatusBadge dueDate={assignment.due_date} />
      </div>
      <DialogTitle className='break-words pr-6 text-xl leading-snug'>{assignment.title}</DialogTitle>
      <DialogDescription>Assignment details</DialogDescription>
    </DialogHeader>

    <div className='space-y-4'>
      <div className='whitespace-pre-wrap break-words rounded-lg bg-muted/50 p-4 text-sm'>
        {assignment.description || <span className='text-muted-foreground'>No description provided.</span>}
      </div>

      <dl className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <Meta
          icon={CalendarClock}
          label='Due'
          value={assignment.due_date ? formatDateTime(assignment.due_date) : 'No deadline'}
        />
        <Meta icon={CalendarPlus} label='Created' value={formatDateTime(assignment.created_at)} />
      </dl>
    </div>

    <DialogFooter className='gap-2 sm:gap-0'>
      <Button variant='outline' onClick={onClose}>
        Close
      </Button>
      <Button onClick={() => onEdit(assignment)}>
        <Pencil className='h-4 w-4' /> Edit
      </Button>
    </DialogFooter>
  </>
)

const Meta = ({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string }) => (
  <div className='flex items-start gap-3 rounded-lg border p-3'>
    <Icon className='mt-0.5 h-4 w-4 text-muted-foreground' />
    <div>
      <dt className='text-xs text-muted-foreground'>{label}</dt>
      <dd className='text-sm font-medium'>{value}</dd>
    </div>
  </div>
)

export default AssignmentModal