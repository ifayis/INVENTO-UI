import { useEffect, useMemo, useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    RefreshCw,
    Search,
    Users,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import CustomerDialog from '@/features/customers/components/CustomerDialog'
import CustomerTable from '@/features/customers/components/CustomerTable'
import DeleteCustomerDialog from '@/features/customers/components/DeleteCustomerDialog'
import CustomerDetailsDialog from '@/features/customers/components/CustomerDetailsDialog'

import {
    useCreateCustomerMutation,
    useDeleteCustomerMutation,
    useGetCustomersQuery,
    useRestoreCustomerMutation,
    useUpdateCustomerMutation,
} from '@/features/customers/customersApi'

import { getApiErrorMessage } from '@/utils/apiError'

const PAGE_SIZE = 10

function extractCustomers(response) {
    const data = response?.data

    if (Array.isArray(data)) {
        return data
    }

    if (Array.isArray(data?.items)) {
        return data.items
    }

    if (Array.isArray(data?.data)) {
        return data.data
    }

    if (Array.isArray(response?.items)) {
        return response.items
    }

    return []
}

function getPaginationInfo(response, customers) {
    const data = response?.data

    const totalCount =
        data?.totalCount ??
        data?.totalItems ??
        response?.totalCount ??
        response?.totalItems ??
        customers.length

    const totalPages =
        data?.totalPages ??
        response?.totalPages ??
        Math.max(
            1,
            Math.ceil(totalCount / PAGE_SIZE),
        )

    return {
        totalCount,
        totalPages,
    }
}

export default function CustomersPage() {
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')

    const [pageNumber, setPageNumber] = useState(1)

    const [customerDialogOpen, setCustomerDialogOpen] =
        useState(false)

    const [editingCustomer, setEditingCustomer] =
        useState(null)

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false)

    const [customerToDelete, setCustomerToDelete] =
        useState(null)

    const [detailsDialogOpen, setDetailsDialogOpen] =
        useState(false)

    const [selectedCustomer, setSelectedCustomer] =
        useState(null)

    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetCustomersQuery({
        search,
        pageNumber,
        pageSize: PAGE_SIZE,
        includeDeleted: true,
    })

    const [
        createCustomer,
        {
            isLoading: isCreating,
        },
    ] = useCreateCustomerMutation()

    const [
        updateCustomer,
        {
            isLoading: isUpdating,
        },
    ] = useUpdateCustomerMutation()

    const [
        deleteCustomer,
        {
            isLoading: isDeleting,
        },
    ] = useDeleteCustomerMutation()

    const [
        restoreCustomer,
        {
            isLoading: isRestoring,
        },
    ] = useRestoreCustomerMutation()

    const [restoringCustomerId, setRestoringCustomerId] =
        useState(null)
    /*
     * Debounce search.
     */
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearch(searchInput.trim())
            setPageNumber(1)
        }, 400)

        return () => clearTimeout(timeoutId)
    }, [searchInput])

    const customers = useMemo(
        () => extractCustomers(data),
        [data],
    )

    const pagination = useMemo(
        () => getPaginationInfo(data, customers),
        [data, customers],
    )

    const handleCreate = () => {
        setEditingCustomer(null)
        setCustomerDialogOpen(true)
    }

    const handleEdit = (customer) => {
        setEditingCustomer(customer)
        setCustomerDialogOpen(true)
    }

    const handleView = (customer) => {
        setSelectedCustomer(customer)
        setDetailsDialogOpen(true)
    }

    const handleDelete = (customer) => {
        setCustomerToDelete(customer)
        setDeleteDialogOpen(true)
    }

    const handleDialogChange = (open) => {
        setCustomerDialogOpen(open)

        if (!open) {
            setEditingCustomer(null)
        }
    }

    const handleDeleteDialogChange = (open) => {
        if (isDeleting) {
            return
        }

        setDeleteDialogOpen(open)

        if (!open) {
            setCustomerToDelete(null)
        }
    }

    const handleSubmitCustomer = async (formData) => {
        try {
            if (editingCustomer) {
                await updateCustomer({
                    id: editingCustomer.id,
                    ...formData,
                }).unwrap()

                toast.success(
                    'Customer updated successfully.',
                )
            } else {
                await createCustomer(formData).unwrap()

                toast.success(
                    'Customer created successfully.',
                )
            }

            setCustomerDialogOpen(false)
            setEditingCustomer(null)
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    editingCustomer
                        ? 'Unable to update customer.'
                        : 'Unable to create customer.',
                ),
            )
        }
    }

    const handleConfirmDelete = async () => {
        if (!customerToDelete?.id) {
            return
        }

        try {
            await deleteCustomer(
                customerToDelete.id,
            ).unwrap()

            toast.success(
                'Customer deleted successfully.',
            )

            setDeleteDialogOpen(false)
            setCustomerToDelete(null)

            /*
             * If the last row on the current page was deleted,
             * move back one page when appropriate.
             */
            if (
                customers.length === 1 &&
                pageNumber > 1
            ) {
                setPageNumber((current) => current - 1)
            }
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    'Unable to delete customer.',
                ),
            )
        }
    }

    const handleRestore = async (customer) => {
        if (!customer?.id) {
            return
        }

        setRestoringCustomerId(customer.id)

        try {
            await restoreCustomer(
                customer.id,
            ).unwrap()

            toast.success(
                'Customer restored successfully.',
            )
        } catch (error) {
            toast.error(
                getApiErrorMessage(
                    error,
                    'Unable to restore customer.',
                ),
            )
        } finally {
            setRestoringCustomerId(null)
        }
    }
    const handlePreviousPage = () => {
        setPageNumber((current) =>
            Math.max(1, current - 1),
        )
    }

    const handleNextPage = () => {
        setPageNumber((current) =>
            Math.min(
                pagination.totalPages,
                current + 1,
            ),
        )
    }

    const handleRefresh = () => {
        refetch()
    }

    const firstItem =
        pagination.totalCount === 0
            ? 0
            : (pageNumber - 1) * PAGE_SIZE + 1

    const lastItem =
        pagination.totalCount === 0
            ? 0
            : Math.min(
                pageNumber * PAGE_SIZE,
                pagination.totalCount,
            )

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Customers
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage your customers and their
                                contact information.
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={handleCreate}
                    className="w-full sm:w-auto"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Customer
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <input
                        type="search"
                        value={searchInput}
                        onChange={(event) =>
                            setSearchInput(event.target.value)
                        }
                        placeholder="Search customers..."
                        className="h-10 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        aria-label="Search customers"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {isFetching && !isLoading && (
                        <span className="hidden text-xs text-muted-foreground sm:inline">
                            Updating...
                        </span>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isFetching}
                    >
                        <RefreshCw
                            className={`mr-2 h-4 w-4 ${isFetching
                                ? 'animate-spin'
                                : ''
                                }`}
                        />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Error */}
            {isError ? (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-12 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/10">
                        <Users className="h-5 w-5 text-destructive" />
                    </div>

                    <h2 className="mt-4 text-base font-semibold">
                        Unable to load customers
                    </h2>

                    <p className="mt-1 max-w-md text-sm text-muted-foreground">
                        Something went wrong while loading your
                        customer records.
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        className="mt-5"
                        onClick={handleRefresh}
                    >
                        Try again
                    </Button>
                </div>
            ) : (
                <>
                    {/* Table */}
                    <CustomerTable
                        customers={customers}
                        isLoading={isLoading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                        deletingCustomerId={
                            isDeleting
                                ? customerToDelete?.id
                                : null
                        }
                        restoringCustomerId={restoringCustomerId} />

                    {/* Pagination */}
                    {!isLoading &&
                        pagination.totalCount > 0 && (
                            <div className="flex flex-col gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing{' '}
                                    <span className="font-medium text-foreground">
                                        {firstItem}
                                    </span>{' '}
                                    to{' '}
                                    <span className="font-medium text-foreground">
                                        {lastItem}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium text-foreground">
                                        {pagination.totalCount}
                                    </span>{' '}
                                    customers
                                </p>

                                <div className="flex items-center justify-between gap-3 sm:justify-end">
                                    <span className="text-sm text-muted-foreground">
                                        Page {pageNumber} of{' '}
                                        {pagination.totalPages}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={
                                                handlePreviousPage
                                            }
                                            disabled={
                                                pageNumber <= 1 ||
                                                isFetching
                                            }
                                            aria-label="Previous page"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={
                                                handleNextPage
                                            }
                                            disabled={
                                                pageNumber >=
                                                pagination.totalPages ||
                                                isFetching
                                            }
                                            aria-label="Next page"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                </>
            )}

            {/* Create / Edit */}
            <CustomerDialog
                open={customerDialogOpen}
                onOpenChange={handleDialogChange}
                customer={editingCustomer}
                onSubmit={handleSubmitCustomer}
                isSubmitting={
                    isCreating || isUpdating
                }
            />

            {/* Delete */}
            <DeleteCustomerDialog
                open={deleteDialogOpen}
                onOpenChange={
                    handleDeleteDialogChange
                }
                customer={customerToDelete}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
            />

            {/* Details */}
            <CustomerDetailsDialog
                open={detailsDialogOpen}
                onOpenChange={setDetailsDialogOpen}
                customer={selectedCustomer}
            />
        </div>
    )
}