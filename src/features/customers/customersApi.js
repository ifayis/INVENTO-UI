import { baseApi } from '@/api/baseApi'

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({
        search = '',
        pageNumber = 1,
        pageSize = 10,
        includeDeleted = true,
      } = {}) => ({
        url: '/Customers',
        method: 'GET',
        params: {
          Search: search || undefined,
          PageNumber: pageNumber,
          PageSize: pageSize,
          IncludeDeleted: includeDeleted,
        },
      }),

      providesTags: (result) => {
        const customers =
          extractCustomers(result)

        return [
          {
            type: 'Customer',
            id: 'LIST',
          },
          ...customers.map(
            (customer) => ({
              type: 'Customer',
              id: customer.id,
            }),
          ),
        ]
      },
    }),

    getCustomerById: builder.query({
      query: (id) => ({
        url: `/Customers/${id}`,
        method: 'GET',
      }),

      providesTags: (_result, _error, id) => [
        {
          type: 'Customer',
          id,
        },
      ],
    }),

    getCustomerDashboard: builder.query({
      query: () => ({
        url: '/Customers/dashboard',
        method: 'GET',
      }),

      providesTags: [
        {
          type: 'Customer',
          id: 'DASHBOARD',
        },
      ],
    }),

    getTopCustomers: builder.query({
      query: () => ({
        url: '/Customers/top-customers',
        method: 'GET',
      }),

      providesTags: ['Customer'],
    }),

    getInactiveCustomers: builder.query({
      query: () => ({
        url: '/Customers/inactive',
        method: 'GET',
      }),

      providesTags: ['Customer'],
    }),

    getCustomerLedger: builder.query({
      query: (customerId) => ({
        url: `/Customers/${customerId}/ledger`,
        method: 'GET',
      }),

      providesTags: (_result, _error, customerId) => [
        {
          type: 'Customer',
          id: `${customerId}-LEDGER`,
        },
      ],
    }),

    getCustomerSalesSummary: builder.query({
      query: (customerId) => ({
        url: `/Customers/${customerId}/sales-summary`,
        method: 'GET',
      }),

      providesTags: (_result, _error, customerId) => [
        {
          type: 'Customer',
          id: `${customerId}-SALES-SUMMARY`,
        },
      ],
    }),

    createCustomer: builder.mutation({
      query: ({
        name,
        email,
        phoneNumber,
        address,
      }) => ({
        url: '/Customers',
        method: 'POST',
        data: {
          name: name.trim(),
          email: email?.trim() || '',
          phoneNumber:
            phoneNumber?.trim() || '',
          address:
            address?.trim() || '',
        },
      }),

      invalidatesTags: [
        {
          type: 'Customer',
          id: 'LIST',
        },
        {
          type: 'Customer',
          id: 'DASHBOARD',
        },
        'Dashboard',
      ],
    }),

    updateCustomer: builder.mutation({
      query: ({
        id,
        name,
        email,
        phoneNumber,
        address,
      }) => ({
        url: `/Customers/${id}`,
        method: 'PUT',
        data: {
          name: name.trim(),
          email: email?.trim() || '',
          phoneNumber:
            phoneNumber?.trim() || '',
          address:
            address?.trim() || '',
        },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        {
          type: 'Customer',
          id,
        },
        {
          type: 'Customer',
          id: 'LIST',
        },
        {
          type: 'Customer',
          id: 'DASHBOARD',
        },
        {
          type: 'Customer',
          id: `${id}-LEDGER`,
        },
        {
          type: 'Customer',
          id: `${id}-SALES-SUMMARY`,
        },
        'Dashboard',
      ],
    }),

    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/Customers/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: 'Customer',
          id,
        },
        {
          type: 'Customer',
          id: 'LIST',
        },
        {
          type: 'Customer',
          id: 'DASHBOARD',
        },
        'Dashboard',
      ],
    }),

    restoreCustomer: builder.mutation({
      query: (id) => ({
        url: `/Customers/${id}/restore`,
        method: 'PUT',
      }),

      invalidatesTags: (_result, _error, id) => [
        {
          type: 'Customer',
          id,
        },
        {
          type: 'Customer',
          id: 'LIST',
        },
        {
          type: 'Customer',
          id: 'DASHBOARD',
        },
        'Dashboard',
      ],
    }),
  }),

  overrideExisting: false,
})

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

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useGetCustomerDashboardQuery,
  useGetTopCustomersQuery,
  useGetInactiveCustomersQuery,
  useGetCustomerLedgerQuery,
  useGetCustomerSalesSummaryQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useRestoreCustomerMutation,
} = customersApi