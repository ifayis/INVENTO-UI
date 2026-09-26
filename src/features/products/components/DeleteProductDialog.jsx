import { AlertTriangle, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DeleteProductDialog({
  open,
  product,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-product-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="delete-product-title"
                className="font-semibold"
              >
                Delete Product
              </h2>

              <p className="text-sm text-muted-foreground">
                This action will remove the product from the active
                product list.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Product
            </p>

            <p className="mt-1 font-semibold">
              {product?.name || 'Selected product'}
            </p>

            {product?.sku && (
              <p className="mt-1 text-xs text-muted-foreground">
                SKU: {product.sku}
              </p>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            The product will be soft-deleted. Its historical
            business records are not removed.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
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

            Delete Product
          </Button>
        </div>
      </div>
    </div>
  )
}