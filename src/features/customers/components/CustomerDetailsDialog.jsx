import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { useGetCustomerByIdQuery } from '@/features/customers/customersApi'

function getInitials(name) {
  if (!name) {
    return 'C'
  }

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`
    .toUpperCase()
}

function formatValue(value) {
  return value || 'Not provided'
}

function DetailItem({
  icon: Icon,
  label,
  value,
  copyable = false,
}) {
  const handleCopy = async () => {
    if (!value) {
      return
    }

    try {
      await navigator.clipboard.writeText(value)
      toast.success(`${label} copied`)
    } catch {
      toast.error(`Unable to copy ${label.toLowerCase()}`)
    }
  }

  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p className="mt-1 break-words text-sm font-medium">
            {formatValue(value)}
          </p>
        </div>

        {copyable && value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleCopy}
            title={`Copy ${label}`}
            aria-label={`Copy ${label}`}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <div className="h-28 animate-pulse rounded-2xl bg-muted" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
        <AlertCircle className="h-5 w-5 text-destructive" />
      </div>

      <h3 className="mt-4 font-semibold">
        Unable to load customer
      </h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        We couldn't retrieve the latest customer
        information. Please try again.
      </p>

      <Button
        type="button"
        variant="outline"
        className="mt-5"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  )
}

export default function CustomerDetailsDialog({
  open,
  onOpenChange,
  customer,
}) {
  const customerId = customer?.id

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCustomerByIdQuery(customerId, {
    skip: !open || !customerId,
  })

  const customerData =
    data?.data ?? customer

  if (!customer) {
    return null
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>

          <DialogDescription>
            View the customer's profile and contact
            information.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className="space-y-5">
            {/* Profile header */}
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                    {getInitials(
                      customerData?.name,
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-lg font-semibold">
                        {customerData?.name ||
                          'Unnamed customer'}
                      </h3>

                      {customerData?.isDeleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          Deleted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Customer profile
                    </p>
                  </div>
                </div>

                {isFetching && !isLoading && (
                  <span className="text-xs text-muted-foreground">
                    Updating...
                  </span>
                )}
              </div>
            </div>

            {/* Contact information */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold">
                  Contact Information
                </h3>

                <p className="text-xs text-muted-foreground">
                  Customer contact details
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={customerData?.email}
                  copyable
                />

                <DetailItem
                  icon={Phone}
                  label="Phone"
                  value={
                    customerData?.phoneNumber
                  }
                  copyable
                />
              </div>
            </section>

            {/* Address */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold">
                  Address
                </h3>

                <p className="text-xs text-muted-foreground">
                  Customer address information
                </p>
              </div>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Address
                    </p>

                    <p className="mt-1 whitespace-pre-wrap break-words text-sm font-medium">
                      {formatValue(
                        customerData?.address,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Customer identity */}
            <section>
              <div className="mb-3">
                <h3 className="text-sm font-semibold">
                  Customer Information
                </h3>

                <p className="text-xs text-muted-foreground">
                  Basic customer record information
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={UserRound}
                  label="Customer Name"
                  value={customerData?.name}
                  copyable
                />

                <DetailItem
                  icon={CheckCircle2}
                  label="Status"
                  value={
                    customerData?.isDeleted
                      ? 'Deleted'
                      : 'Active'
                  }
                />
              </div>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}