import { motion } from 'framer-motion'

const currencyFormatter = new Intl.NumberFormat(
  'en-IN',
  {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  },
)

function formatCurrency(value) {
  return currencyFormatter.format(
    Number(value || 0),
  )
}

function getInitials(name) {
  return String(name || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join('')
}

export default function RankingList({
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
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center text-sm text-muted-foreground">
        No data available yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        let name
        let primary
        let secondary

        if (type === 'product') {
          name = item.productName
          primary = formatCurrency(
            item.revenue,
          )
          secondary = `${item.quantitySold} units sold`
        }

        if (type === 'customer') {
          name = item.customerName
          primary = formatCurrency(
            item.totalSpent,
          )
          secondary = `${item.totalOrders} orders`
        }

        if (type === 'supplier') {
          name = item.supplierName
          primary = formatCurrency(
            item.totalAmount,
          )
          secondary = `${item.totalPurchases} purchases`
        }

        return (
          <motion.div
            key={
              item.productId ||
              item.customerId ||
              item.supplierId
            }
            initial={{
              opacity: 0,
              x: -8,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: index * 0.04,
            }}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {getInitials(name)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {name}
              </p>

              <p className="text-xs text-muted-foreground">
                {secondary}
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold">
              {primary}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}