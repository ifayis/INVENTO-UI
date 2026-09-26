import { baseApi } from '@/api/baseApi'

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({
                search = '',
                pageNumber = 1,
                pageSize = 10,
                includeDeleted = false,
            } = {}) => ({
                url: '/Products',
                method: 'GET',
                params: {
                    Search: search || undefined,
                    PageNumber: pageNumber,
                    PageSize: pageSize,
                    IncludeDeleted: includeDeleted,
                },
            }),

            providesTags: (result) => {
                const products = extractProducts(result)

                return [
                    { type: 'Product', id: 'LIST' },
                    ...products.map((product) => ({
                        type: 'Product',
                        id: product.id,
                    })),
                ]
            },
        }),

        getProductById: builder.query({
            query: (id) => ({
                url: `/Products/${id}`,
                method: 'GET',
            }),

            providesTags: (_result, _error, id) => [
                { type: 'Product', id },
            ],
        }),

        getProductImages: builder.query({
            query: (productId) => ({
                url: `/Products/${productId}/images`,
                method: 'GET',
            }),

            providesTags: (_result, _error, productId) => [
                { type: 'Product', id: productId },
            ],
        }),

        getProductStockHistory: builder.query({
            query: (productId) => ({
                url: `/Products/${productId}/stock-history`,
                method: 'GET',
            }),
        }),

        getProductSalesHistory: builder.query({
            query: (productId) => ({
                url: `/Products/${productId}/sales-history`,
                method: 'GET',
            }),
        }),

        getProductPurchaseHistory: builder.query({
            query: (productId) => ({
                url: `/Products/${productId}/purchase-history`,
                method: 'GET',
            }),
        }),

        createProduct: builder.mutation({
            query: ({
                name,
                sku,
                sellingPrice,
                categoryId,
                lowStockThreshold,
                criticalStockThreshold,
            }) => ({
                url: '/Products',
                method: 'POST',
                data: {
                    name: name.trim(),
                    sku: sku.trim(),
                    sellingPrice,
                    categoryId,
                    lowStockThreshold,
                    criticalStockThreshold,
                },
            }),

            invalidatesTags: [
                { type: 'Product', id: 'LIST' },
                'Dashboard',
                'Report',
            ],
        }),

        updateProduct: builder.mutation({
            query: ({
                id,
                name,
                sku,
                sellingPrice,
                categoryId,
                lowStockThreshold,
                criticalStockThreshold,
            }) => ({
                url: `/Products/${id}`,
                method: 'PUT',
                data: {
                    name: name.trim(),
                    sku: sku.trim(),
                    sellingPrice,
                    categoryId,
                    lowStockThreshold,
                    criticalStockThreshold,
                },
            }),

            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
                'Dashboard',
                'Report',
            ],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/Products/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_result, _error, id) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
                'Dashboard',
                'Report',
            ],
        }),

        restoreProduct: builder.mutation({
            query: (id) => ({
                url: `/Products/${id}/restore`,
                method: 'PUT',
            }),

            invalidatesTags: (_result, _error, id) => [
                { type: 'Product', id },
                { type: 'Product', id: 'LIST' },
                'Dashboard',
                'Report',
            ],
        }),

                uploadProductImage: builder.mutation({
            query: ({ productId, image }) => {
                const formData = new FormData()

                formData.append('image', image)

                return {
                    url: `/Products/${productId}/images`,
                    method: 'POST',
                    data: formData,
                }
            },

            invalidatesTags: (_result, _error, { productId }) => [
                { type: 'Product', id: productId },
                { type: 'Product', id: 'LIST' },
            ],
        }),

        setPrimaryProductImage: builder.mutation({
            query: ({ imageId }) => ({
                url: `/Products/images/${imageId}/primary`,
                method: 'PUT',
            }),

            invalidatesTags: ['Product'],
        }),

        deleteProductImage: builder.mutation({
            query: (imageId) => ({
                url: `/Products/images/${imageId}`,
                method: 'DELETE',
            }),

            invalidatesTags: ['Product'],
        }),
    }),

    overrideExisting: false,
})

function extractProducts(response) {
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

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetProductImagesQuery,
    useGetProductStockHistoryQuery,
    useGetProductSalesHistoryQuery,
    useGetProductPurchaseHistoryQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useRestoreProductMutation,
    useUploadProductImageMutation,
    useSetPrimaryProductImageMutation,
    useDeleteProductImageMutation,
} = productsApi