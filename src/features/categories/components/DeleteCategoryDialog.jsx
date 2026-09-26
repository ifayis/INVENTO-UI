import {
  AlertTriangle,
  Loader2,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function DeleteCategoryDialog({
  open,
  category,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={
          isDeleting
            ? undefined
            : onClose
        }
      />

      <div
        role="alertdialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">
              Delete category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">
                {category?.name}
              </span>
              ? The category will be soft-deleted and can
              be restored later.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            Delete category
          </Button>
        </div>
      </div>
    </div>
  )
}