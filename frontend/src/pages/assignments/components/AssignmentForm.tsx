import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { assignmentSchema, type AssignmentFormValues } from '../schema'

interface AssignmentFormProps {
  defaultValues?: Partial<AssignmentFormValues>
  submitLabel: string
  onSubmit: (values: AssignmentFormValues) => Promise<void>
  onCancel: () => void
}

const AssignmentForm = ({ defaultValues, submitLabel, onSubmit, onCancel }: AssignmentFormProps) => {
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: { title: '', description: '', due_date: '', ...defaultValues },
  })
  const { isSubmitting } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Chapter 4 problem set' autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={4} placeholder='Instructions, links, grading notes...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='due_date'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due date</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormDescription>Leave empty if there is no deadline.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter className='gap-2 sm:gap-0'>
          <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting && <Loader2 className='h-4 w-4 animate-spin' />}
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

export default AssignmentForm