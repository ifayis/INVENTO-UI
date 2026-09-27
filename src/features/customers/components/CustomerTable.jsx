import {
    Edit3,
    Eye,
    Info,
    Loader2,
    Package,
    RotateCcw,
    Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
        return '—'
    }

    return phoneNumber
}

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

function ActionButton({
    label,
    icon: Icon,
    onClick,
    disabled = false,
    destructive = false,
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className={
                destructive
                    ? 'h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                    : 'h-8 w-8 text-muted-foreground hover:bg-muted hover:text-foreground'
            }
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
        >
            <Icon className="h-4 w-4" />
        </Button>
    )
}

function CustomerRow({
    customer,
    onView,
    onEdit,
    onDelete,
    onRestore,
    onOrders,
    isDeleting,
    isRestoring,
}) {
    const deleted = Boolean(customer.isDeleted)

    return (
        <tr
            className={`border-b last:border-0 ${
                deleted
                    ? 'bg-muted/20 opacity-75'
                    : 'hover:bg-muted/30'
            }`}
        >
            {/* Customer */}
            <td className="px-4 py-4 sm:px-5">
                <div className="flex min-w-[220px] items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                        {getInitials(customer.name)}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate font-medium">
                            {customer.name || 'Unnamed customer'}
                        </p>

                        {customer.email && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {customer.email}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            {/* Phone */}
            <td className="whitespace-nowrap px-4 py-4 text-sm text-muted-foreground sm:px-5">
                {formatPhoneNumber(customer.phoneNumber)}
            </td>

            {/* Address */}
            <td className="max-w-[280px] px-4 py-4 sm:px-5">
                <p className="truncate text-sm text-muted-foreground">
                    {customer.address || '—'}
                </p>
            </td>

            {/* Status */}
            <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                {deleted ? (
                    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                        Deleted
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        Active
                    </span>
                )}
            </td>

            {/* Actions */}
            <td className="px-4 py-4 sm:px-5">
                <div className="flex items-center justify-end gap-1">

                    {/* View Orders */}
                    <ActionButton
                        label="View orders"
                        icon={Info}
                        onClick={() => onOrders?.(customer)}
                    />

                    {/* View Customer */}
                    <ActionButton
                        label="View customer"
                        icon={Eye}
                        onClick={() => onView?.(customer)}
                    />

                    {deleted ? (
                        /* Restore */
                        <ActionButton
                            label="Restore customer"
                            icon={
                                isRestoring
                                    ? Loader2
                                    : RotateCcw
                            }
                            onClick={() =>
                                onRestore?.(customer)
                            }
                            disabled={isRestoring}
                        />
                    ) : (
                        <>
                            {/* Edit */}
                            <ActionButton
                                label="Edit customer"
                                icon={Edit3}
                                onClick={() =>
                                    onEdit?.(customer)
                                }
                            />

                            {/* Delete */}
                            <ActionButton
                                label="Delete customer"
                                icon={
                                    isDeleting
                                        ? Loader2
                                        : Trash2
                                }
                                onClick={() =>
                                    onDelete?.(customer)
                                }
                                disabled={isDeleting}
                                destructive
                            />
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}

export default function CustomerTable({
    customers = [],
    onView,
    onEdit,
    onDelete,
    onRestore,
    onOrders,
    deletingCustomerId = null,
    restoringCustomerId = null,
    isLoading = false,
}) {
    if (isLoading) {
        return (
            <div className="rounded-2xl border bg-card">
                <div className="flex min-h-80 items-center justify-center p-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />

                        <p className="text-sm text-muted-foreground">
                            Loading customers...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (!customers.length) {
        return (
            <div className="rounded-2xl border bg-card">
                <div className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Package className="h-6 w-6 text-primary" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold">
                        No customers found
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                        No customers match your current search or
                        filter.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="overflow-hidden rounded-2xl border bg-card">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left">
                    <thead className="border-b bg-muted/30">
                        <tr>
                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">
                                Customer
                            </th>

                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">
                                Phone
                            </th>

                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">
                                Address
                            </th>

                            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">
                                Status
                            </th>

                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {customers.map((customer) => (
                            <CustomerRow
                                key={customer.id}
                                customer={customer}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onRestore={onRestore}
                                onOrders={onOrders}
                                isDeleting={
                                    deletingCustomerId === customer.id
                                }
                                isRestoring={
                                    restoringCustomerId === customer.id
                                }
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}