import { useEffect, useMemo, useState } from 'react'
import { useTable } from '@refinedev/react-table'
import { Plus, Search } from 'lucide-react'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import type { Assignment, AssignmentModalState } from '@/types/assignment'
import { getAssignmentColumns } from './components/AssignmentColumns'
import AssignmentModal from './components/AssignmentModal'
import AssignmentDeleteDialog from './components/AssignmentDeleteDialog'

const AssignmentList = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 400)
  const [modal, setModal] = useState<AssignmentModalState>(null)
  const [toDelete, setToDelete] = useState<Assignment | null>(null)

  const columns = useMemo(
    () =>
      getAssignmentColumns({
        onView: (assignment) => setModal({ mode: 'show', assignment }),
        onEdit: (assignment) => setModal({ mode: 'edit', assignment }),
        onDelete: setToDelete,
      }),
    [],
  )

  const table = useTable<Assignment>({
    columns,
    refineCoreProps: {
      resource: 'assignments',
      pagination: { pageSize: 10 },
      sorters: { initial: [{ field: 'created_at', order: 'desc' }] },
    },
  })

  const { setFilters, tableQuery } = table.refineCore
  const total = tableQuery.data?.total ?? 0

  useEffect(() => {
    setFilters(
      debouncedSearch ? [{ field: 'title', operator: 'contains', value: debouncedSearch }] : [],
      'replace',
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <ListView>
      <Breadcrumb />

      <div className='mb-6 mt-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>Assignments</h1>
          <p className='mt-1 text-muted-foreground'>
            {total} {total === 1 ? 'assignment' : 'assignments'} in total
          </p>
        </div>
        <Button className='gap-2 self-start md:self-auto' onClick={() => setModal({ mode: 'create' })}>
          <Plus className='h-4 w-4' /> Create Assignment
        </Button>
      </div>

      <div className='space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-6'>
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search by title...'
            className='w-full pl-10'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <DataTable table={table} />
      </div>

      <AssignmentModal
        state={modal}
        onClose={() => setModal(null)}
        onEdit={(assignment) => setModal({ mode: 'edit', assignment })}
      />
      <AssignmentDeleteDialog assignment={toDelete} onClose={() => setToDelete(null)} />
    </ListView>
  )
}

export default AssignmentList