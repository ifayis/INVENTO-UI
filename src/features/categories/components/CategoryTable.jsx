import {
  MoreHorizontal,
  Pencil,
  RefreshCcw,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function CategoryTable({
  categories,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  onRestore,
}) {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border">
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-lg bg-muted"
              />
            ),
          )}
        </div>
      </div>
    )
  }

  if (!categories.length) {
    return (
      <div className="rounded-2xl border border-dashed p-10 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Trash2 className="h-5 w-5 text-muted-foreground" />
          </div>

          <h3 className="font-semibold">
            No categories found
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or create a
            new category.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b bg-muted/40">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Category
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Products
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Created
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>

              <th className="w-16 px-5 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {categories.map((category) => {
              const id =
                category.id ||
                category.Id

              const name =
                category.name ||
                category.Name ||
                'Unnamed'

              const productCount =
                category.productCount ??
                category.ProductCount

              const isDeleted =
                category.isDeleted ??
                category.IsDeleted ??
                false

              return (
                <tr
                  key={id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium">
                      {name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {productCount ?? '—'}
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(
                      category.createdAt ||
                        category.CreatedAt,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={[
                        'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
                        isDeleted
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-primary/10 text-primary',
                      ].join(' ')}
                    >
                      {isDeleted
                        ? 'Deleted'
                        : 'Active'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      {!isDeleted && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onEdit(category)
                            }
                            aria-label={`Edit ${name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              onDelete(category)
                            }
                            aria-label={`Delete ${name}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </>
                      )}

                      {isDeleted && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            onRestore(category)
                          }
                          aria-label={`Restore ${name}`}
                        >
                          <RefreshCcw className="h-4 w-4" />
                        </Button>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="hidden"
                        aria-label="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {isFetching && (
        <div className="border-t px-5 py-2 text-xs text-muted-foreground">
          Updating categories...
        </div>
      )}
    </div>
  )
}