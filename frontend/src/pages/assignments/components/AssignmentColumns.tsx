import type { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableSorter } from '@/components/refine-ui/data-table/data-table-sorter'
import { formatDate, formatDateTime } from '@/lib/assignment-status'
import type { Assignment } from '@/types/assignment'
import AssignmentStatusBadge from './AssignmentStatusBadge'

interface ColumnHandlers {
  onView: (assignment: Assignment) => void
  onEdit: (assignment: Assignment) => void
  onDelete: (assignment: Assignment) => void
}

export const getAssignmentColumns = ({ onView, onEdit, onDelete }: ColumnHandlers): ColumnDef<Assignment>[] => [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => <DataTableSorter column={column} title='Assignment' />,
    cell: ({ row }) => {
      const a = row.original
      return (
        <button type='button' onClick={() => onView(a)} className='block max-w-[240px] text-left sm:max-w-sm'>
          <p className='truncate font-medium text-foreground hover:underline'>{a.title}</p>
          {a.description && <p className='truncate text-xs text-muted-foreground'>{a.description}</p>}
        </button>
      )
    },
  },
  {
    id: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => <AssignmentStatusBadge dueDate={row.original.due_date} />,
  },
  {
    id: 'due_date',
    accessorKey: 'due_date',
    header: ({ column }) => <DataTableSorter column={column} title='Due date' />,
    cell: ({ row }) => {
      const due = row.original.due_date
      return <span className='whitespace-nowrap text-muted-foreground'>{due ? formatDateTime(due) : '—'}</span>
    },
  },
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableSorter column={column} title='Created' />,
    cell: ({ row }) => (
      <span className='whitespace-nowrap text-muted-foreground'>{formatDate(row.original.created_at)}</span>
    ),
  },
  {
    id: 'actions',
    header: () => <span className='sr-only'>Actions</span>,
    enableSorting: false,
    cell: ({ row }) => {
      const a = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='h-8 w-8' aria-label='Open actions'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onView(a)}>
              <Eye className='h-4 w-4' /> View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(a)}>
              <Pencil className='h-4 w-4' /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(a)}
              className='text-destructive focus:text-destructive'
            >
              <Trash2 className='h-4 w-4' /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]