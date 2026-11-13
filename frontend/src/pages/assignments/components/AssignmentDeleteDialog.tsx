import { useState } from 'react'
import { useDelete } from '@refinedev/core'
import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Assignment } from '@/types/assignment'

interface AssignmentDeleteDialogProps {
  assignment: Assignment | null
  onClose: () => void
}

const AssignmentDeleteDialog = ({ assignment, onClose }: AssignmentDeleteDialogProps) => {
  const { mutateAsync: remove } = useDelete()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!assignment) return
    setIsDeleting(true)
    try {
      await remove({ resource: 'assignments', id: assignment.id })
      onClose()
    } catch {
      // Refine shows the error toast
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={assignment !== null} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this assignment?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className='font-medium text-foreground'>{assignment?.title}</span> will be permanently
            deleted. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault() // keep the dialog open until the request finishes
              handleDelete()
            }}
            className='bg-destructive text-white hover:bg-destructive/90'
          >
            {isDeleting && <Loader2 className='h-4 w-4 animate-spin' />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default AssignmentDeleteDialog