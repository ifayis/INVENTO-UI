import { baseApi } from '@/api/baseApi'

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({
        search = '',
        pageNumber = 1,
        pageSize = 10,
        includeDeleted = true,
      } = {}) => ({
        url: '/Categories',
        method: 'GET',
        params: {
          Search: search || undefined,
          PageNumber: pageNumber,
          PageSize: pageSize,
          IncludeDeleted: includeDeleted,
        },
      }),

      providesTags: (result) => {
        const categories = extractCategories(result)

        return [
          { type: 'Category', id: 'LIST' },
          ...categories.map((category) => ({
            type: 'Category',
            id: category.id,
          })),
        ]
      },
    }),

    getCategoryById: builder.query({
      query: (id) => ({
        url: `/Categories/${id}`,
        method: 'GET',
      }),

      providesTags: (_result, _error, id) => [
        {
          type: 'Category',
          id,
        },
      ],
    }),

    createCategory: builder.mutation({
      query: ({ name }) => ({
        url: '/Categories',
        method: 'POST',
        data: {
          name: name.trim(),
        },
      }),

      invalidatesTags: [
        { type: 'Category', id: 'LIST' },
      ],
    }),

    updateCategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `/Categories/${id}`,
        method: 'PUT',
        data: {
          name: name.trim(),
        },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/Categories/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    restoreCategory: builder.mutation({
      query: (id) => ({
        url: `/Categories/${id}/restore`,
        method: 'PUT',
      }),

      invalidatesTags: (_result, _error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),

  overrideExisting: false,
})

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

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
} = categoriesApi