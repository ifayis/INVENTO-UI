import { useEffect } from 'react'
import { AlertCircle, Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'

const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Category name is required')
    .max(
      150,
      'Category name cannot exceed 150 characters',
    ),
})

export default function CategoryDialog({
  open,
  mode = 'create',
  category = null,
  onClose,
  onSubmit,
  isSubmitting = false,
  errorMessage = '',
}) {
  const isEdit = mode === 'edit'

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm({
    resolver:
      zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }

    reset({
      name: category?.name ?? '',
    })
  }, [
    open,
    category,
    reset,
  ])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={
          isSubmitting
            ? undefined
            : onClose
        }
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-dialog-title"
        className="relative z-10 w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="category-dialog-title"
              className="text-lg font-semibold"
            >
              {isEdit
                ? 'Edit category'
                : 'Create category'}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {isEdit
                ? 'Update the category name.'
                : 'Add a new product category.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="category-name"
              className="mb-2 block text-sm font-medium"
            >
              Category name
            </label>

            <input
              id="category-name"
              type="text"
              maxLength={150}
              autoFocus
              disabled={isSubmitting}
              placeholder="e.g. Electronics"
              {...register('name')}
              className={[
                'h-11 w-full rounded-lg border bg-background px-3 text-sm',
                'outline-none transition',
                'focus:border-primary focus:ring-2 focus:ring-primary/20',
                errors.name
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                  : '',
              ].join(' ')}
            />

            {errors.name && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Backend error */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <p className="leading-5">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {isEdit
                ? 'Save changes'
                : 'Create category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}