import { useEffect, useState } from 'react'
import {
    ImageOff,
    ImagePlus,
    Loader2,
    Package,
    Trash2,
    X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'

import {
    useGetCategoriesQuery,
} from '@/features/categories/categoriesApi'

import {
    useDeleteProductImageMutation,
    useGetProductImagesQuery,
} from '@/features/products/productsApi'

import { API_BASE_URL } from '@/constants/app'

const productSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(1, 'Product name is required')
            .max(
                200,
                'Product name cannot exceed 200 characters',
            ),

        sku: z
            .string()
            .trim()
            .min(1, 'SKU is required')
            .max(
                100,
                'SKU cannot exceed 100 characters',
            ),

        sellingPrice: z
            .coerce
            .number()
            .finite(
                'Selling price must be a valid number',
            )
            .positive(
                'Selling price must be greater than 0',
            ),

        categoryId: z
            .string()
            .min(1, 'Category is required'),

        lowStockThreshold: z
            .coerce
            .number()
            .int(
                'Low stock threshold must be a whole number',
            )
            .min(
                0,
                'Low stock threshold cannot be negative',
            ),

        criticalStockThreshold: z
            .coerce
            .number()
            .int(
                'Critical stock threshold must be a whole number',
            )
            .min(
                0,
                'Critical stock threshold cannot be negative',
            ),
    })
    .refine(
        (data) =>
            data.criticalStockThreshold <=
            data.lowStockThreshold,
        {
            message:
                'Critical stock threshold must be less than or equal to low stock threshold.',
            path: ['criticalStockThreshold'],
        },
    )

const defaultValues = {
    name: '',
    sku: '',
    sellingPrice: '',
    categoryId: '',
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
}

export default function ProductDialog({
    open,
    mode = 'create',
    product = null,
    onClose,
    onSubmit,
    isSubmitting = false,
    errorMessage = '',
}) {
    const isEdit = mode === 'edit'

    const [selectedImages, setSelectedImages] =
        useState([])

    const [imageError, setImageError] =
        useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues,
    })

    const {
        data: categoriesResponse,
        isLoading: categoriesLoading,
    } = useGetCategoriesQuery(
        {
            search: '',
            pageNumber: 1,
            pageSize: 100,
        },
        {
            skip: !open,
        },
    )

    const {
        data: existingImagesResponse,
        isLoading: existingImagesLoading,
        isFetching: existingImagesFetching,
    } = useGetProductImagesQuery(
        product?.id,
        {
            skip:
                !open ||
                !isEdit ||
                !product?.id,
        },
    )

    const [
        deleteProductImage,
        {
            isLoading: isDeletingImage,
        },
    ] = useDeleteProductImageMutation()

    const categories =
        extractCategories(categoriesResponse)

    const existingImages =
        extractImages(existingImagesResponse)

    useEffect(() => {
        if (!open) {
            return
        }

        reset({
            name: product?.name ?? '',
            sku: product?.sku ?? '',
            sellingPrice:
                product?.sellingPrice !== undefined
                    ? String(product.sellingPrice)
                    : '',
            categoryId:
                product?.categoryId ?? '',
            lowStockThreshold:
                product?.lowStockThreshold ?? 10,
            criticalStockThreshold:
                product?.criticalStockThreshold ?? 5,
        })

        setSelectedImages([])
        setImageError('')
    }, [
        open,
        product,
        reset,
    ])

    const handleImageChange = (event) => {
        const files = Array.from(
            event.target.files ?? [],
        )

        setImageError('')

        if (files.length === 0) {
            setSelectedImages([])
            return
        }

        const invalidType = files.find(
            (file) =>
                ![
                    'image/jpeg',
                    'image/png',
                    'image/webp',
                ].includes(file.type),
        )

        if (invalidType) {
            setSelectedImages([])

            setImageError(
                'Only JPG, JPEG, PNG and WebP images are allowed.',
            )

            event.target.value = ''
            return
        }

        const invalidSize = files.find(
            (file) =>
                file.size > 5 * 1024 * 1024,
        )

        if (invalidSize) {
            setSelectedImages([])

            setImageError(
                'Each image must be smaller than 5 MB.',
            )

            event.target.value = ''
            return
        }

        setSelectedImages(files)
    }

    const removeImage = (index) => {
        setSelectedImages((current) =>
            current.filter(
                (_file, fileIndex) =>
                    fileIndex !== index,
            ),
        )
    }

    const handleRemoveExistingImage =
        async (image) => {
            if (!image?.id) {
                return
            }

            try {
                await deleteProductImage(
                    image.id,
                ).unwrap()

                toast.success(
                    'Product image removed successfully.',
                )
            } catch (error) {
                console.error(
                    'Image deletion failed:',
                    error,
                )

                toast.error(
                    getApiErrorMessage(error) ||
                        'Unable to remove product image.',
                )
            }
        }

    const submit = (values) => {
        onSubmit({
            ...values,

            sellingPrice: Number(
                values.sellingPrice,
            ),

            lowStockThreshold: Number(
                values.lowStockThreshold,
            ),

            criticalStockThreshold: Number(
                values.criticalStockThreshold,
            ),

            images: selectedImages,
        })
    }

    if (!open) {
        return null
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
        >
            <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4 sm:px-6 sm:py-5">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Package className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                            <h2
                                id="product-dialog-title"
                                className="truncate text-lg font-semibold"
                            >
                                {isEdit
                                    ? 'Edit Product'
                                    : 'Create Product'}
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                {isEdit
                                    ? 'Update the product information.'
                                    : 'Add a new product to your inventory.'}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="ml-3 shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close dialog"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(submit)}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    {/* Scrollable Content */}
                    <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
                        {/* Backend Error */}
                        {errorMessage && (
                            <div
                                className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                                role="alert"
                            >
                                {errorMessage}
                            </div>
                        )}

                        {/* General Information */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="font-semibold">
                                    General Information
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Basic product identification
                                    details.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Product Name"
                                    error={
                                        errors.name?.message
                                    }
                                >
                                    <input
                                        {...register('name')}
                                        placeholder="e.g. Wireless Keyboard"
                                        className={inputClass(
                                            !!errors.name,
                                        )}
                                        disabled={
                                            isSubmitting
                                        }
                                    />
                                </Field>

                                <Field
                                    label="SKU"
                                    error={
                                        errors.sku?.message
                                    }
                                >
                                    <input
                                        {...register('sku')}
                                        placeholder="e.g. KB-001"
                                        className={inputClass(
                                            !!errors.sku,
                                        )}
                                        disabled={
                                            isSubmitting
                                        }
                                    />
                                </Field>
                            </div>

                            <Field
                                label="Category"
                                error={
                                    errors.categoryId
                                        ?.message
                                }
                            >
                                <select
                                    {...register(
                                        'categoryId',
                                    )}
                                    className={inputClass(
                                        !!errors.categoryId,
                                    )}
                                    disabled={
                                        isSubmitting ||
                                        categoriesLoading
                                    }
                                >
                                    <option value="">
                                        {categoriesLoading
                                            ? 'Loading categories...'
                                            : 'Select category'}
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        ),
                                    )}
                                </select>
                            </Field>
                        </section>

                        {/* Pricing */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="font-semibold">
                                    Pricing
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Configure the product
                                    selling price.
                                </p>
                            </div>

                            <Field
                                label="Selling Price"
                                error={
                                    errors.sellingPrice
                                        ?.message
                                }
                            >
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                        ₹
                                    </span>

                                    <input
                                        {...register(
                                            'sellingPrice',
                                        )}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        className={`${inputClass(
                                            !!errors.sellingPrice,
                                        )} pl-8`}
                                        disabled={
                                            isSubmitting
                                        }
                                    />
                                </div>
                            </Field>
                        </section>

                        {/* Inventory Configuration */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="font-semibold">
                                    Inventory Configuration
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Configure stock warning
                                    levels for this product.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field
                                    label="Low Stock Threshold"
                                    error={
                                        errors
                                            .lowStockThreshold
                                            ?.message
                                    }
                                >
                                    <input
                                        {...register(
                                            'lowStockThreshold',
                                        )}
                                        type="number"
                                        min="0"
                                        step="1"
                                        className={inputClass(
                                            !!errors.lowStockThreshold,
                                        )}
                                        disabled={
                                            isSubmitting
                                        }
                                    />

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Show a low-stock
                                        warning when stock
                                        reaches this level.
                                    </p>
                                </Field>

                                <Field
                                    label="Critical Stock Threshold"
                                    error={
                                        errors
                                            .criticalStockThreshold
                                            ?.message
                                    }
                                >
                                    <input
                                        {...register(
                                            'criticalStockThreshold',
                                        )}
                                        type="number"
                                        min="0"
                                        step="1"
                                        className={inputClass(
                                            !!errors.criticalStockThreshold,
                                        )}
                                        disabled={
                                            isSubmitting
                                        }
                                    />

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Mark the product as
                                        critical below this
                                        level.
                                    </p>
                                </Field>
                            </div>
                        </section>

                        {/* Product Images */}
                        <section className="space-y-4">
                            <div>
                                <h3 className="font-semibold">
                                    Product Images
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    {isEdit
                                        ? 'Manage existing images or add new images to this product.'
                                        : 'Add one or more images for this product.'}
                                </p>
                            </div>

                            {/* Existing Images */}
                            {isEdit && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium">
                                            Existing Images
                                        </p>

                                        {existingImages.length >
                                            0 && (
                                            <span className="shrink-0 text-xs text-muted-foreground">
                                                {
                                                    existingImages.length
                                                }{' '}
                                                {existingImages.length ===
                                                1
                                                    ? 'image'
                                                    : 'images'}
                                            </span>
                                        )}
                                    </div>

                                    {existingImagesLoading ||
                                    existingImagesFetching ? (
                                        <div className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-muted/20">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                        </div>
                                    ) : existingImages.length ===
                                      0 ? (
                                        <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 text-center">
                                            <ImageOff className="h-6 w-6 text-muted-foreground" />

                                            <p className="mt-2 text-sm font-medium">
                                                No existing images
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                Add images using
                                                the upload area
                                                below.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                            {existingImages.map(
                                                (
                                                    image,
                                                ) => (
                                                    <ExistingImage
                                                        key={
                                                            image.id
                                                        }
                                                        image={
                                                            image
                                                        }
                                                        disabled={
                                                            isDeletingImage ||
                                                            isSubmitting
                                                        }
                                                        onDelete={() =>
                                                            handleRemoveExistingImage(
                                                                image,
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Upload Area */}
                            <label
                                htmlFor="product-images"
                                className="flex min-h-44 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-5 py-8 text-center transition hover:border-primary hover:bg-primary/5 sm:min-h-48 sm:px-6 sm:py-10"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <ImagePlus className="h-7 w-7" />
                                </div>

                                <p className="mt-4 text-sm font-semibold">
                                    {isEdit
                                        ? 'Add more product images'
                                        : 'Add product images'}
                                </p>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Click here to select
                                    images
                                </p>

                                <p className="mt-2 text-xs text-muted-foreground">
                                    JPG, JPEG, PNG or WebP •
                                    Maximum 5 MB per image
                                </p>

                                <input
                                    id="product-images"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    className="hidden"
                                    onChange={
                                        handleImageChange
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                />
                            </label>

                            {/* Image Validation Error */}
                            {imageError && (
                                <div
                                    className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                                    role="alert"
                                >
                                    {imageError}
                                </div>
                            )}

                            {/* New Selected Images */}
                            {selectedImages.length >
                                0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-medium">
                                            Images to upload
                                        </p>

                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {
                                                selectedImages.length
                                            }{' '}
                                            {selectedImages.length ===
                                            1
                                                ? 'image'
                                                : 'images'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                        {selectedImages.map(
                                            (
                                                file,
                                                index,
                                            ) => (
                                                <SelectedImage
                                                    key={`${file.name}-${file.lastModified}-${index}`}
                                                    file={
                                                        file
                                                    }
                                                    onRemove={() =>
                                                        removeImage(
                                                            index,
                                                        )
                                                    }
                                                    disabled={
                                                        isSubmitting
                                                    }
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Footer */}
                    <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-muted/20 px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={
                                isSubmitting
                            }
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                isSubmitting
                            }
                            className="w-full sm:w-auto"
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            {isEdit
                                ? 'Save Changes'
                                : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function ExistingImage({
    image,
    disabled,
    onDelete,
}) {
    const imageUrl =
        resolveImageUrl(
            image?.imageUrl,
        )

    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-muted">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={
                        image.originalFileName ||
                        image.fileName ||
                        'Product image'
                    }
                    className="aspect-square w-full object-cover"
                    onError={(event) => {
                        event.currentTarget.style.display =
                            'none'

                        const fallback =
                            event.currentTarget
                                .nextElementSibling

                        fallback?.classList.remove(
                            'hidden',
                        )
                    }}
                />
            ) : null}

            <div
                className={`${
                    imageUrl
                        ? 'hidden '
                        : ''
                }flex aspect-square flex-col items-center justify-center gap-2 p-3 text-center`}
            >
                <ImageOff className="h-7 w-7 text-muted-foreground" />

                <span className="text-[11px] text-muted-foreground">
                    Image unavailable
                </span>
            </div>

            {image.isPrimary && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground shadow">
                    Primary
                </span>
            )}

            <button
                type="button"
                onClick={onDelete}
                disabled={disabled}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-white opacity-100 shadow transition hover:bg-destructive disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                title="Remove image"
                aria-label="Remove image"
            >
                {disabled ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Trash2 className="h-4 w-4" />
                )}
            </button>
        </div>
    )
}

function SelectedImage({
    file,
    onRemove,
    disabled,
}) {
    const [previewUrl, setPreviewUrl] =
        useState('')

    useEffect(() => {
        const url =
            URL.createObjectURL(file)

        setPreviewUrl(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [file])

    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-muted">
            {previewUrl ? (
                <img
                    src={previewUrl}
                    alt={file.name}
                    className="aspect-square w-full object-cover"
                />
            ) : (
                <div className="flex aspect-square items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            )}

            <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Remove ${file.name}`}
                title="Remove image"
            >
                <X className="h-4 w-4" />
            </button>

            <div className="truncate bg-background/90 px-2 py-1.5 text-xs">
                {file.name}
            </div>
        </div>
    )
}

function Field({
    label,
    error,
    children,
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium">
                {label}
            </label>

            {children}

            {error && (
                <p className="mt-1.5 text-xs text-destructive">
                    {error}
                </p>
            )}
        </div>
    )
}

function inputClass(hasError) {
    return [
        'w-full rounded-xl border bg-background px-3 py-2.5 text-sm',
        'outline-none transition',
        'placeholder:text-muted-foreground',
        'focus:ring-2 focus:ring-primary/20',
        hasError
            ? 'border-destructive focus:border-destructive'
            : 'border-input focus:border-primary',
    ].join(' ')
}

function extractCategories(response) {
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

function extractImages(response) {
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

function resolveImageUrl(value) {
    if (!value) {
        return ''
    }

    if (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('blob:')
    ) {
        return value
    }

    try {
        const origin =
            new URL(
                API_BASE_URL,
            ).origin

        if (value.startsWith('/')) {
            return `${origin}${value}`
        }

        return `${origin}/${value}`
    } catch {
        return value
    }
}

function getApiErrorMessage(error) {
    return (
        error?.data?.message ||
        error?.data?.error ||
        error?.data?.errors?.[0] ||
        error?.message ||
        ''
    )
}