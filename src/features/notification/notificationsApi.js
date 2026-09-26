import { baseApi } from '@/api/baseApi'

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLowStockNotifications: builder.query({
      query: () => ({
        url: '/Targets/low-stock',
        method: 'GET',
      }),
      providesTags: ['Target'],
    }),

    getCriticalStockNotifications: builder.query({
      query: () => ({
        url: '/Targets/critical-stock',
        method: 'GET',
      }),
      providesTags: ['Target'],
    }),

    getReorderNotifications: builder.query({
      query: () => ({
        url: '/Targets/reorder-products',
        method: 'GET',
      }),
      providesTags: ['Target'],
    }),

    getReceivableNotifications: builder.query({
      query: () => ({
        url: '/Receivables/outstanding',
        method: 'GET',
      }),
      providesTags: ['Receivable'],
    }),

    getPayableNotifications: builder.query({
      query: () => ({
        url: '/Payables/outstanding',
        method: 'GET',
      }),
      providesTags: ['Payable'],
    }),
  }),
})

export const {
  useGetLowStockNotificationsQuery,
  useGetCriticalStockNotificationsQuery,
  useGetReorderNotificationsQuery,
  useGetReceivableNotificationsQuery,
  useGetPayableNotificationsQuery,
} = notificationsApi