import {
  ImageOff,
  Loader2,
  Package,
  X,
} from 'lucide-react'

import {
  useGetProductByIdQuery,
  useGetProductImagesQuery,
} from '@/features/products/productsApi'

import { API_BASE_URL } from '@/constants/app'

export default function ProductDetailsDialog({
  open,
  product,
  onClose,
}) {
  const productId = product?.id

  const {
    data: productResponse,
    isLoading: productLoading,
    isError: productError,
  } = useGetProductByIdQuery(
    productId,
    {
      skip:
        !open ||
        !productId,
    },
  )

  const {
    data: imagesResponse,
    isLoading: imagesLoading,
    isError: imagesError,
  } = useGetProductImagesQuery(
    productId,
    {
      skip:
        !open ||
        !productId,
    },
  )

  if (!open) {
    return null
  }

  const productDetails =
    productResponse?.data ?? product

  const images =
    extractImages(imagesResponse)

  const loading =
    productLoading ||
    imagesLoading

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-details-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2
                id="product-details-title"
                className="truncate text-lg font-semibold"
              >
                Product Details
              </h2>

              <p className="text-sm text-muted-foreground">
                View product information and images.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
              {/* Images */}
              <section className="min-w-0">
                <div className="mb-4">
                  <h3 className="text-base font-semibold">
                    Product Images
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Images associated with this product.
                  </p>
                </div>

                {imagesError ? (
                  <ImageEmptyState
                    title="Unable to load images"
                    description="The product images could not be loaded."
                  />
                ) : images.length === 0 ? (
                  <ImageEmptyState
                    title="No image found"
                    description="This product does not have any images yet."
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                    {images.map((image) => {
                      const imageUrl =
                        resolveImageUrl(
                          image.imageUrl,
                        )

                      return (
                        <div
                          key={image.id}
                          className="group relative overflow-hidden rounded-2xl border border-border bg-muted"
                        >
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={
                                image.originalFileName ||
                                image.fileName ||
                                productDetails?.name ||
                                'Product image'
                              }
                              className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                              onError={(event) => {
                                event.currentTarget.style.display =
                                  'none'

                                const fallback =
                                  event.currentTarget
                                    .nextElementSibling

                                if (
                                  fallback
                                ) {
                                  fallback.classList.remove(
                                    'hidden',
                                  )
                                }
                              }}
                            />
                          ) : null}

                          <div
                            className={`${
                              imageUrl
                                ? 'hidden '
                                : ''
                            }flex aspect-square flex-col items-center justify-center px-3 text-center`}
                          >
                            <ImageOff className="h-8 w-8 text-muted-foreground" />

                            <span className="mt-2 text-xs text-muted-foreground">
                              Image unavailable
                            </span>
                          </div>

                          {image.isPrimary && (
                            <span className="absolute left-2 top-2 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground shadow">
                              Primary
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              {/* Product Information */}
              <section className="min-w-0">
                <div className="mb-4">
                  <h3 className="text-base font-semibold">
                    Product Information
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Current information for this product.
                  </p>
                </div>

                {productError ? (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    Unable to load the latest product
                    information.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <InfoItem
                      label="Product Name"
                      value={
                        productDetails?.name
                      }
                    />

                    <InfoItem
                      label="SKU"
                      value={
                        productDetails?.sku
                      }
                    />

                    <InfoItem
                      label="Category"
                      value={
                        productDetails?.categoryName
                      }
                    />

                    <InfoItem
                      label="Cost Price"
                      value={formatCurrency(
                        productDetails?.costPrice,
                      )}
                    />

                    <InfoItem
                      label="Selling Price"
                      value={formatCurrency(
                        productDetails?.sellingPrice,
                      )}
                    />

                    <InfoItem
                      label="Current Stock"
                      value={
                        productDetails?.currentStock ??
                        0
                      }
                    />

                    <InfoItem
                      label="Low Stock Threshold"
                      value={
                        productDetails?.lowStockThreshold ??
                        0
                      }
                    />

                    <InfoItem
                      label="Critical Stock Threshold"
                      value={
                        productDetails?.criticalStockThreshold ??
                        0
                      }
                    />

                    <InfoItem
                      label="Created"
                      value={formatDate(
                        productDetails?.createdAt,
                      )}
                    />
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ImageEmptyState({
  title,
  description,
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 text-center sm:min-h-80">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <ImageOff className="h-7 w-7" />
      </div>

      <p className="mt-4 font-medium">
        {title}
      </p>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 px-4 py-3">
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words font-medium">
        {value ?? '-'}
      </p>
    </div>
  )
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
    const apiOrigin =
      new URL(API_BASE_URL).origin

    if (value.startsWith('/')) {
      return `${apiOrigin}${value}`
    }

    return `${apiOrigin}/${value}`
  } catch {
    return value
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    },
  ).format(Number(value ?? 0))
}

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
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