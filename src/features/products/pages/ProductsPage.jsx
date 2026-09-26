import { useEffect, useMemo, useState } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    Package,
    Plus,
    RefreshCcw,
    RotateCcw,
    Search,
} from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import ProductDialog from '@/features/products/components/ProductDialog'
import DeleteProductDialog from '@/features/products/components/DeleteProductDialog'
import ProductDetailsDialog from '@/features/products/components/ProductDetailsDialog'
import ProductTable from '@/features/products/components/ProductTable'

import {
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetProductsQuery,
    useRestoreProductMutation,
    useUpdateProductMutation,
    useUploadProductImageMutation,
} from '@/features/products/productsApi'

export default function ProductsPage() {
    const [searchInput, setSearchInput] = useState('')
    const [search, setSearch] = useState('')
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState('create')

    const [selectedProduct, setSelectedProduct] =
        useState(null)

    const [deleteOpen, setDeleteOpen] =
        useState(false)

    const [detailsOpen, setDetailsOpen] =
        useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput.trim())
            setPageNumber(1)
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchInput])

    const {
        data: productsResponse,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useGetProductsQuery({
        search,
        pageNumber,
        pageSize,
        includeDeleted: true,
    })

    const [
        createProduct,
        {
            isLoading: isCreating,
            error: createError,
        },
    ] = useCreateProductMutation()

    const [
        updateProduct,
        {
            isLoading: isUpdating,
            error: updateError,
        },
    ] = useUpdateProductMutation()

    const [
        uploadProductImage,
        {
            isLoading: isUploadingImage,
        },
    ] = useUploadProductImageMutation()

    const [
        deleteProduct,
        {
            isLoading: isDeleting,
            error: deleteError,
        },
    ] = useDeleteProductMutation()

    const [
        restoreProduct,
        {
            isLoading: isRestoring,
        },
    ] = useRestoreProductMutation()

    const productsData = useMemo(
        () => extractPagedData(productsResponse),
        [productsResponse],
    )

    const products = productsData.items

    const totalCount = productsData.totalCount

    const currentPage =
        productsData.pageNumber || pageNumber

    const currentPageSize =
        productsData.pageSize || pageSize

    const totalPages = Math.max(
        1,
        Math.ceil(
            totalCount / currentPageSize,
        ),
    )

    const dialogError = getApiErrorMessage(
        dialogMode === 'create'
            ? createError
            : updateError,
    )

    const handleOpenCreate = () => {
        setSelectedProduct(null)
        setDialogMode('create')
        setDialogOpen(true)
    }

    const handleOpenEdit = (product) => {
        setSelectedProduct(product)
        setDialogMode('edit')
        setDialogOpen(true)
    }

    const handleCloseDialog = () => {
        if (
            isCreating ||
            isUpdating ||
            isUploadingImage
        ) {
            return
        }

        setDialogOpen(false)
        setSelectedProduct(null)
    }

    const handleSubmitProduct = async (values) => {
        try {
            const images = Array.isArray(values.images)
                ? values.images
                : []

            const {
                images: _images,
                ...productValues
            } = values

            let productResponse

            if (dialogMode === 'create') {
                productResponse =
                    await createProduct(
                        productValues,
                    ).unwrap()

                toast.success(
                    'Product created successfully.',
                )
            } else {
                productResponse =
                    await updateProduct({
                        id: selectedProduct.id,
                        ...productValues,
                    }).unwrap()

                toast.success(
                    'Product updated successfully.',
                )
            }

            const productId =
                productResponse?.data?.id ??
                productResponse?.data

            if (
                productId &&
                images.length > 0
            ) {
                for (const image of images) {
                    await uploadProductImage({
                        productId,
                        image,
                    }).unwrap()
                }

                toast.success(
                    images.length === 1
                        ? 'Product image uploaded successfully.'
                        : `${images.length} product images uploaded successfully.`,
                )
            }

            setDialogOpen(false)
            setSelectedProduct(null)

            await refetch()
        } catch (error) {
            console.error(
                'Product mutation failed:',
                error,
            )

            toast.error(
                getApiErrorMessage(error) ||
                'Unable to save product.',
            )
        }
    }

    const handleOpenDelete = (product) => {
        setSelectedProduct(product)
        setDeleteOpen(true)
    }

    const handleCloseDelete = () => {
        if (
            isDeleting ||
            isRestoring
        ) {
            return
        }

        setDeleteOpen(false)
        setSelectedProduct(null)
    }

    const handleDelete = async () => {
        if (!selectedProduct?.id) {
            return
        }

        try {
            await deleteProduct(
                selectedProduct.id,
            ).unwrap()

            toast.success(
                'Product deleted successfully.',
            )

            setDeleteOpen(false)
            setSelectedProduct(null)

            if (
                products.length === 1 &&
                pageNumber > 1
            ) {
                setPageNumber(
                    (current) => current - 1,
                )
            }
        } catch (error) {
            console.error(
                'Product deletion failed:',
                error,
            )

            toast.error(
                getApiErrorMessage(error) ||
                'Unable to delete product.',
            )
        }
    }

    const handleRestore = async (product) => {
        if (!product?.id) {
            return
        }

        try {
            await restoreProduct(
                product.id,
            ).unwrap()

            toast.success(
                'Product restored successfully.',
            )

            await refetch()
        } catch (error) {
            console.error(
                'Product restore failed:',
                error,
            )

            toast.error(
                getApiErrorMessage(error) ||
                'Unable to restore product.',
            )
        }
    }

    const handleViewProduct = (product) => {
        setSelectedProduct(product)
        setDetailsOpen(true)
    }

    const handleCloseDetails = () => {
        setDetailsOpen(false)
        setSelectedProduct(null)
    }

    const handleRefresh = () => {
        refetch()
    }

    const handlePreviousPage = () => {
        setPageNumber((current) =>
            Math.max(1, current - 1),
        )
    }

    const handleNextPage = () => {
        setPageNumber((current) =>
            Math.min(
                totalPages,
                current + 1,
            ),
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Package className="h-5 w-5" />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Products
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Manage your products, pricing and
                            inventory thresholds.
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleOpenCreate}
                    className="w-full sm:w-auto"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* Toolbar */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <input
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(
                                    event.target.value,
                                )
                            }
                            placeholder="Search by product name or SKU..."
                            className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="flex w-full items-center gap-2 md:w-auto">
                        <select
                            value={pageSize}
                            onChange={(event) => {
                                setPageSize(
                                    Number(event.target.value),
                                )
                                setPageNumber(1)
                            }}
                            className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary md:flex-none"
                            aria-label="Products per page"
                        >
                            <option value={10}>
                                10 / page
                            </option>
                            <option value={20}>
                                20 / page
                            </option>
                            <option value={50}>
                                50 / page
                            </option>
                        </select>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleRefresh}
                            disabled={isFetching}
                            title="Refresh products"
                        >
                            <RefreshCcw
                                className={`h-4 w-4 ${isFetching
                                        ? 'animate-spin'
                                        : ''
                                    }`}
                            />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Error */}
            {isError && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5">
                    <p className="font-medium text-destructive">
                        Unable to load products.
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Please check your connection and try
                        again.
                    </p>

                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={handleRefresh}
                    >
                        Try Again
                    </Button>
                </div>
            )}

            {/* Table */}
            {!isError && (
                <ProductTable
                    products={products}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                    onView={handleViewProduct}
                    onRestore={handleRestore}
                    isRestoring={isRestoring}
                />
            )}

            {/* Empty */}
            {!isLoading &&
                !isError &&
                products.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Package className="h-7 w-7" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold">
                            {search
                                ? 'No products found'
                                : 'No products yet'}
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                            {search
                                ? 'Try changing your search term.'
                                : 'Create your first product to start managing your inventory.'}
                        </p>

                        {!search && (
                            <Button
                                className="mt-5"
                                onClick={handleOpenCreate}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        )}
                    </div>
                )}

            {/* Pagination */}
            {!isLoading &&
                !isError &&
                products.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing{' '}
                            <span className="font-medium text-foreground">
                                {(currentPage - 1) *
                                    currentPageSize +
                                    1}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium text-foreground">
                                {Math.min(
                                    currentPage *
                                    currentPageSize,
                                    totalCount,
                                )}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium text-foreground">
                                {totalCount}
                            </span>{' '}
                            products
                        </p>

                        <div className="flex items-center justify-between gap-2 sm:justify-end">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={
                                    handlePreviousPage
                                }
                                disabled={
                                    currentPage <= 1 ||
                                    isFetching
                                }
                                aria-label="Previous page"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <span className="min-w-24 text-center text-sm">
                                Page {currentPage} of{' '}
                                {totalPages}
                            </span>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextPage}
                                disabled={
                                    currentPage >=
                                    totalPages ||
                                    isFetching
                                }
                                aria-label="Next page"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

            {/* Create / Edit */}
            <ProductDialog
                open={dialogOpen}
                mode={dialogMode}
                product={selectedProduct}
                onClose={handleCloseDialog}
                onSubmit={handleSubmitProduct}
                isSubmitting={
                    isCreating ||
                    isUpdating ||
                    isUploadingImage
                }
                errorMessage={dialogError}
            />

            {/* Details */}
            <ProductDetailsDialog
                open={detailsOpen}
                product={selectedProduct}
                onClose={handleCloseDetails}
            />

            {/* Delete */}
            <DeleteProductDialog
                open={deleteOpen}
                product={selectedProduct}
                onClose={handleCloseDelete}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />

            {deleteError && (
                <div
                    className="sr-only"
                    aria-live="polite"
                >
                    {getApiErrorMessage(deleteError)}
                </div>
            )}
        </div>
    )
}

function extractPagedData(response) {
    const data = response?.data

    if (data?.items) {
        return {
            items: data.items,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalCount:
                data.totalCount ?? 0,
        }
    }

    return {
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
    }
}

function getApiErrorMessage(error) {
    if (!error) {
        return ''
    }

    return (
        error?.data?.message ||
        error?.data?.error ||
        error?.data?.errors?.[0] ||
        error?.message ||
        'Something went wrong. Please try again.'
    )
}