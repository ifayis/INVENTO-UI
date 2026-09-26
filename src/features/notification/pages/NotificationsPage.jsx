import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CircleDollarSign,
  CreditCard,
  Package,
  RefreshCw,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  useGetCriticalStockNotificationsQuery,
  useGetLowStockNotificationsQuery,
  useGetReorderNotificationsQuery,
  useGetReceivableNotificationsQuery,
  useGetPayableNotificationsQuery,
} from '@/features/notification/notificationsApi'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSelectors'
import { Button } from '@/components/ui/button'

const TABS = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'stock', label: 'Stock' },
  { value: 'finance', label: 'Finance' },
]

function getResponseData(response) {
  return Array.isArray(response?.data)
    ? response.data
    : []
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function NotificationCard({
  icon: Icon,
  title,
  description,
  meta,
  tone = 'default',
}) {
  const toneClasses = {
    critical:
      'border-destructive/20 bg-destructive/5',
    warning:
      'border-amber-500/20 bg-amber-500/5',
    info:
      'border-primary/20 bg-primary/5',
    finance:
      'border-blue-500/20 bg-blue-500/5',
    default:
      'border-border bg-card',
  }

  const iconClasses = {
    critical: 'text-destructive',
    warning: 'text-amber-500',
    info: 'text-primary',
    finance: 'text-blue-500',
    default: 'text-muted-foreground',
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-colors hover:bg-muted/30 ${toneClasses[tone]}`}
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-background">
          <Icon
            className={`h-5 w-5 ${iconClasses[tone]}`}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {title}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>

          {meta && (
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {meta}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function NotificationSection({
  title,
  icon: Icon,
  children,
  count,
}) {
  if (!count) {
    return null
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />

        <h2 className="text-sm font-semibold">
          {title}
        </h2>

        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count}
        </span>
      </div>

      <div className="grid gap-3">
        {children}
      </div>
    </section>
  )
}

export default function NotificationsPage() {
  const user = useSelector(selectCurrentUser)

  const [activeTab, setActiveTab] =
    useState('all')

  const canViewTargets =
    user?.permissions?.includes('Targets')

  const canViewReceivables =
    user?.permissions?.includes('Receivables')

  const canViewPayables =
    user?.permissions?.includes('Payables')

  const {
    data: lowStockResponse,
    isLoading: isLowStockLoading,
    isError: isLowStockError,
    refetch: refetchLowStock,
  } = useGetLowStockNotificationsQuery(
    undefined,
    {
      skip: !canViewTargets,
    },
  )

  const {
    data: criticalResponse,
    isLoading: isCriticalLoading,
    isError: isCriticalError,
    refetch: refetchCritical,
  } = useGetCriticalStockNotificationsQuery(
    undefined,
    {
      skip: !canViewTargets,
    },
  )

  const {
    data: reorderResponse,
    isLoading: isReorderLoading,
    isError: isReorderError,
    refetch: refetchReorder,
  } = useGetReorderNotificationsQuery(
    undefined,
    {
      skip: !canViewTargets,
    },
  )

  const {
    data: receivableResponse,
    isLoading: isReceivableLoading,
    isError: isReceivableError,
    refetch: refetchReceivables,
  } = useGetReceivableNotificationsQuery(
    undefined,
    {
      skip: !canViewReceivables,
    },
  )

  const {
    data: payableResponse,
    isLoading: isPayableLoading,
    isError: isPayableError,
    refetch: refetchPayables,
  } = useGetPayableNotificationsQuery(
    undefined,
    {
      skip: !canViewPayables,
    },
  )

  const lowStock = useMemo(
    () => getResponseData(lowStockResponse),
    [lowStockResponse],
  )

  const criticalStock = useMemo(
    () => getResponseData(criticalResponse),
    [criticalResponse],
  )

  const reorderProducts = useMemo(
    () => getResponseData(reorderResponse),
    [reorderResponse],
  )

  const receivables = useMemo(
    () => getResponseData(receivableResponse),
    [receivableResponse],
  )

  const payables = useMemo(
    () => getResponseData(payableResponse),
    [payableResponse],
  )

  const criticalIds = useMemo(
    () =>
      new Set(
        criticalStock.map(
          (item) => item.productId,
        ),
      ),
    [criticalStock],
  )

  const filteredLowStock = useMemo(
    () =>
      lowStock.filter(
        (item) =>
          !criticalIds.has(item.productId),
      ),
    [lowStock, criticalIds],
  )

  const totalNotifications =
    criticalStock.length +
    filteredLowStock.length +
    reorderProducts.length +
    receivables.length +
    payables.length

  const isLoading =
    isLowStockLoading ||
    isCriticalLoading ||
    isReorderLoading ||
    isReceivableLoading ||
    isPayableLoading

  const hasError =
    isLowStockError ||
    isCriticalError ||
    isReorderError ||
    isReceivableError ||
    isPayableError

  const handleRefresh = () => {
    if (canViewTargets) {
      refetchLowStock()
      refetchCritical()
      refetchReorder()
    }

    if (canViewReceivables) {
      refetchReceivables()
    }

    if (canViewPayables) {
      refetchPayables()
    }
  }

  const showCritical =
    activeTab === 'all' ||
    activeTab === 'critical'

  const showStock =
    activeTab === 'all' ||
    activeTab === 'stock'

  const showFinance =
    activeTab === 'all' ||
    activeTab === 'finance'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Stay informed about important business activity.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isLoading
                ? 'animate-spin'
                : ''
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Active alerts
            </p>

            <p className="mt-1 text-3xl font-bold">
              {totalNotifications}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <Button
                key={tab.value}
                type="button"
                size="sm"
                variant={
                  activeTab === tab.value
                    ? 'default'
                    : 'outline'
                }
                onClick={() =>
                  setActiveTab(tab.value)
                }
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border bg-card p-8 text-center">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />

          <p className="mt-3 text-sm text-muted-foreground">
            Loading notifications...
          </p>
        </div>
      )}

      {/* Error */}
      {!isLoading && hasError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />

            <div>
              <p className="font-semibold">
                Some notifications could not be loaded
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please refresh and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="space-y-8">
          {/* Critical */}
          {showCritical && (
            <NotificationSection
              title="Critical Stock"
              icon={AlertCircle}
              count={criticalStock.length}
            >
              {criticalStock.map(
                (product) => (
                  <NotificationCard
                    key={product.productId}
                    icon={AlertCircle}
                    title={product.productName}
                    description={`${product.currentStock} units remaining`}
                    meta={`Critical threshold: ${product.criticalStockThreshold}`}
                    tone="critical"
                  />
                ),
              )}
            </NotificationSection>
          )}

          {/* Stock */}
          {showStock && (
            <>
              <NotificationSection
                title="Low Stock"
                icon={AlertTriangle}
                count={filteredLowStock.length}
              >
                {filteredLowStock.map(
                  (product) => (
                    <NotificationCard
                      key={product.productId}
                      icon={AlertTriangle}
                      title={product.productName}
                      description={`${product.currentStock} units remaining`}
                      meta={`Low-stock threshold: ${product.lowStockThreshold}`}
                      tone="warning"
                    />
                  ),
                )}
              </NotificationSection>

              <NotificationSection
                title="Reorder Required"
                icon={Package}
                count={reorderProducts.length}
              >
                {reorderProducts.map(
                  (product) => (
                    <NotificationCard
                      key={product.productId}
                      icon={Package}
                      title={product.productName}
                      description={`${product.currentStock} units currently available`}
                      meta={`Recommended order quantity: ${product.recommendedOrderQuantity}`}
                      tone="info"
                    />
                  ),
                )}
              </NotificationSection>
            </>
          )}

          {/* Finance */}
          {showFinance && (
            <>
              <NotificationSection
                title="Outstanding Receivables"
                icon={CircleDollarSign}
                count={receivables.length}
              >
                {receivables.map(
                  (customer) => (
                    <NotificationCard
                      key={customer.customerId}
                      icon={CircleDollarSign}
                      title={customer.customerName}
                      description={`${formatCurrency(customer.outstandingAmount)} outstanding`}
                      meta={`${formatCurrency(customer.totalPaid)} paid of ${formatCurrency(customer.totalSales)}`}
                      tone="finance"
                    />
                  ),
                )}
              </NotificationSection>

              <NotificationSection
                title="Outstanding Payables"
                icon={CreditCard}
                count={payables.length}
              >
                {payables.map(
                  (supplier) => (
                    <NotificationCard
                      key={supplier.supplierId}
                      icon={CreditCard}
                      title={supplier.supplierName}
                      description={`${formatCurrency(supplier.outstandingAmount)} outstanding`}
                      meta={`${formatCurrency(supplier.totalPaid)} paid of ${formatCurrency(supplier.totalPurchases)}`}
                      tone="finance"
                    />
                  ),
                )}
              </NotificationSection>
            </>
          )}

          {totalNotifications === 0 && (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>

              <h2 className="mt-4 text-lg font-semibold">
                You're all caught up
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                There are no active business alerts at the moment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}