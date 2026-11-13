import type { ElementType } from 'react'
import { useCustom, useList } from '@refinedev/core'
import { Link } from 'react-router'
import { AlertCircle, AlarmClock, CalendarOff, ChevronRight, FileText, Plus } from 'lucide-react'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { formatDate, formatRelativeDue } from '@/lib/assignment-status'
import type { Assignment, AssignmentStats } from '@/types/assignment'
import AssignmentStatusBadge from './assignments/components/AssignmentStatusBadge'

const API_URL = import.meta.env.VITE_API_URL
const STAT_CARDS: {
  key: keyof AssignmentStats
  label: string
  icon: ElementType
  className: string
}[] = [
  { key: 'total', label: 'Total assignments', icon: FileText, className: 'bg-primary/10 text-primary' },
  { key: 'dueSoon', label: 'Due in 3 days', icon: AlarmClock, className: 'bg-amber-500/10 text-amber-600' },
  { key: 'pastDue', label: 'Past due', icon: AlertCircle, className: 'bg-rose-500/10 text-rose-600' },
  { key: 'noDeadline', label: 'No deadline', icon: CalendarOff, className: 'bg-muted text-muted-foreground' },
]

const Dashboard = () => {
  const { query: statsQuery } = useCustom<AssignmentStats>({
    url: `${API_URL}/assignments/stats`,
    method: 'get',
  })

  const { query: recentQuery } = useList<Assignment>({
    resource: 'assignments',
    pagination: { currentPage: 1, pageSize: 5 },
    sorters: [{ field: 'created_at', order: 'desc' }],
  })

  const stats = statsQuery.data?.data
  const recent = recentQuery.data?.data ?? []

  return (
    <ListView>
      <Breadcrumb />

      <div className='mb-6 mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>Dashboard</h1>
          <p className='mt-1 text-muted-foreground'>A quick look at your assignments</p>
        </div>
        <Button asChild className='gap-2 self-start md:self-auto'>
          <Link to='/assignments'>
            Manage assignments
          </Link>
        </Button>
      </div>

      {/* Stat cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {STAT_CARDS.map(({ key, label, icon: Icon, className }) => (
          <div key={key} className='flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm'>
            <div className={cn('rounded-lg p-3', className)}>
              <Icon className='h-5 w-5' />
            </div>
            <div className='min-w-0'>
              {statsQuery.isLoading ? (
                <Skeleton className='mb-1 h-7 w-12' />
              ) : (
                <p className='text-2xl font-bold'>{statsQuery.isError ? '–' : (stats?.[key] ?? 0)}</p>
              )}
              <p className='truncate text-xs text-muted-foreground'>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {statsQuery.isError && (
        <p className='mb-6 text-sm text-destructive'>
          Couldn’t load the statistics.{' '}
          <button type='button' className='underline' onClick={() => statsQuery.refetch()}>
            Try again
          </button>
        </p>
      )}

      {/* Recently created */}
      <div className='rounded-xl border bg-card p-4 shadow-sm sm:p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Recently created</h2>
          <Button asChild variant='ghost' size='sm'>
            <Link to='/assignments'>
              View all <ChevronRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>

        {recentQuery.isLoading ? (
          <div className='space-y-3'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-16 w-full rounded-lg' />
            ))}
          </div>
        ) : recentQuery.isError ? (
          <p className='py-8 text-center text-sm text-destructive'>Couldn’t load assignments.</p>
        ) : recent.length === 0 ? (
          <div className='py-10 text-center'>
            <p className='font-medium'>No assignments yet</p>
            <p className='mt-1 text-sm text-muted-foreground'>Create your first one to see it here.</p>
          </div>
        ) : (
          <ul className='divide-y'>
            {recent.map((a) => (
              <li key={a.id} className='flex items-center justify-between gap-3 py-3'>
                <div className='min-w-0'>
                  <p className='truncate font-medium'>{a.title}</p>
                  <p className='truncate text-xs text-muted-foreground'>
                    Created {formatDate(a.created_at)}
                    {a.due_date && ` · Due ${formatRelativeDue(a.due_date)}`}
                  </p>
                </div>
                <AssignmentStatusBadge dueDate={a.due_date} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </ListView>
  )
}

export default Dashboard