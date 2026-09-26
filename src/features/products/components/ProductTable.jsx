import {
  Edit3,
  Eye,
  Loader2,
  Package,
  RotateCcw,
  Trash2,
} from 'lucide-react'

function isProductDeleted(product) {
  return (
    product?.isDeleted === true ||
    product?.deletedAt != null
  )
}

export default function ProductTable({
  products,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  onView,
  onRestore,
  isRestoring = false,
}) {
  if (isLoading) {
    return <ProductTableSkeleton />
  }

  if (!products.length) {
    return null
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-sm">
          <thead className="border-b border-border bg-muted/40">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Product
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                SKU
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Category
              </th>

              <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                Cost Price
              </th>

              <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                Selling Price
              </th>

              <th className="px-5 py-3 text-center font-medium text-muted-foreground">
                Stock
              </th>

              <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>

              <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onRestore={onRestore}
                isRestoring={isRestoring}
              />
            ))}
          </tbody>
        </table>
      </div>

      {isFetching && (
        <div className="border-t border-border px-5 py-2 text-right text-xs text-muted-foreground">
          Updating...
        </div>
      )}
    </div>
  )
}

function ProductRow({
  product,
  onEdit,
  onDelete,
  onView,
  onRestore,
  isRestoring,
}) {
  const deleted = isProductDeleted(product)
  const stockStatus = getStockStatus(product)

  return (
    <tr
      className={[
        'group transition-colors hover:bg-muted/30',
        deleted ? 'opacity-70' : '',
      ].join(' ')}
    >
      {/* Product */}
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onView(product)}
          className="flex items-center gap-3 text-left"
        >
          <ProductThumbnail product={product} />

          <div className="min-w-0">
            <p className="truncate font-medium transition-colors group-hover:text-primary">
              {product.name}
            </p>

            <p className="text-xs text-muted-foreground">
              {formatDate(product.createdAt)}
            </p>
          </div>
        </button>
      </td>

      {/* SKU */}
      <td className="px-5 py-4 font-mono text-xs">
        {product.sku}
      </td>

      {/* Category */}
      <td className="px-5 py-4">
        <span className="rounded-lg bg-muted px-2.5 py-1 text-xs">
          {product.categoryName}
        </span>
      </td>

      {/* Cost Price */}
      <td className="px-5 py-4 text-right">
        {formatCurrency(product.costPrice)}
      </td>

      {/* Selling Price */}
      <td className="px-5 py-4 text-right font-medium">
        {formatCurrency(product.sellingPrice)}
      </td>

      {/* Stock */}
      <td className="px-5 py-4 text-center">
        <span className="font-semibold">
          {product.currentStock}
        </span>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        {deleted ? (
          <span className="inline-flex rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
            Deleted
          </span>
        ) : (
          <StockBadge status={stockStatus} />
        )}
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex justify-end gap-1">
          {/* View */}
          <ActionButton
            label="View product"
            onClick={() => onView(product)}
          >
            <Eye className="h-4 w-4" />
          </ActionButton>

          {deleted ? (
            /* Restore */
            <ActionButton
              label="Restore product"
              onClick={() => onRestore(product)}
              disabled={isRestoring}
            >
              {isRestoring ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
            </ActionButton>
          ) : (
            <>
              {/* Edit */}
              <ActionButton
                label="Edit product"
                onClick={() => onEdit(product)}
              >
                <Edit3 className="h-4 w-4" />
              </ActionButton>

              {/* Delete */}
              <ActionButton
                label="Delete product"
                destructive
                onClick={() => onDelete(product)}
              >
                <Trash2 className="h-4 w-4" />
              </ActionButton>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

function ProductThumbnail({ product }) {
  if (product.primaryImageUrl) {
    return (
      <img
        src={product.primaryImageUrl}
        alt={product.name}
        className="h-11 w-11 shrink-0 rounded-xl border border-border object-cover"
        loading="lazy"
      />
    )
  }

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      <Package className="h-5 w-5" />
    </div>
  )
}

function ActionButton({
  label,
  children,
  onClick,
  destructive = false,
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={[
        'rounded-lg p-2 transition',
        'disabled:pointer-events-none disabled:opacity-50',
        destructive
          ? 'text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
          : 'text-muted-foreground hover:bg-primary/10 hover:text-primary',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function StockBadge({ status }) {
  const config = {
    healthy: {
      label: 'In Stock',
      className:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },

    low: {
      label: 'Low Stock',
      className:
        'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },

    critical: {
      label: 'Critical',
      className:
        'bg-red-500/10 text-red-600 dark:text-red-400',
    },

    out: {
      label: 'Out of Stock',
      className:
        'bg-red-500/10 text-red-600 dark:text-red-400',
    },
  }

  const item =
    config[status] ?? config.healthy

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.className}`}
    >
      {item.label}
    </span>
  )
}

function getStockStatus(product) {
  const stock =
    Number(product.currentStock ?? 0)

  const low =
    Number(product.lowStockThreshold ?? 10)

  const critical =
    Number(
      product.criticalStockThreshold ?? 5,
    )

  if (stock <= 0) {
    return 'out'
  }

  if (stock <= critical) {
    return 'critical'
  }

  if (stock <= low) {
    return 'low'
  }

  return 'healthy'
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function ProductTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="space-y-4 p-5">
        {Array.from({ length: 7 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex animate-pulse items-center gap-4"
            >
              <div className="h-11 w-11 rounded-xl bg-muted" />

              <div className="h-4 w-40 rounded bg-muted" />

              <div className="h-4 w-24 rounded bg-muted" />

              <div className="ml-auto h-4 w-20 rounded bg-muted" />

              <div className="h-8 w-20 rounded bg-muted" />
            </div>
          ),
        )}
      </div>
    </div>
  )
}