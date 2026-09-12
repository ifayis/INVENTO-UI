import { Link } from 'react-router-dom'

function formatCurrency(value) {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    },
  ).format(Number(value || 0))
}

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(date)
}

export default function RecentTransactions({
  items = [],
  type,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex items-center gap-4"
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
            </div>

            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
        No recent transactions.
      </div>
    )
  }

  return (
    <div className="divide-y">
      {items.map((item) => {
        const isSale = type === 'sale'

        const number = isSale
          ? item.invoiceNumber
          : item.purchaseNumber

        const date = isSale
          ? item.saleDate
          : item.purchaseDate

        const path = isSale
          ? `/sales/${item.id}`
          : `/purchases/${item.id}`

        return (
          <Link
            key={item.id}
            to={path}
            className="flex items-center justify-between gap-4 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-muted/30"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {number || '—'}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(date)}
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold">
              {formatCurrency(
                item.totalAmount,
              )}
            </p>
          </Link>
        )
      })}
    </div>
  )
}