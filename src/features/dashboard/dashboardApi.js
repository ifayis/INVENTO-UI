import { baseApi } from '@/api/baseApi'

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => ({
        url: '/Dashboard/summary',
        method: 'GET',
      }),
    }),

    getRecentSales: builder.query({
      query: (count = 5) => ({
        url: '/Dashboard/recent-sales',
        method: 'GET',
        params: {
          count,
        },
      }),
    }),

    getRecentPurchases: builder.query({
      query: (count = 5) => ({
        url: '/Dashboard/recent-purchases',
        method: 'GET',
        params: {
          count,
        },
      }),
    }),

    getTopProducts: builder.query({
      query: (count = 5) => ({
        url: '/Dashboard/top-products',
        method: 'GET',
        params: {
          count,
        },
      }),
    }),

    getTopCustomers: builder.query({
      query: (count = 5) => ({
        url: '/Dashboard/top-customers',
        method: 'GET',
        params: {
          count,
        },
      }),
    }),

    getTopSuppliers: builder.query({
      query: (count = 5) => ({
        url: '/Dashboard/top-suppliers',
        method: 'GET',
        params: {
          count,
        },
      }),
    }),

    getMonthlySalesChart: builder.query({
      query: () => ({
        url: '/Dashboard/monthly-sales-chart',
        method: 'GET',
      }),
    }),

    getMonthlyPurchasesChart: builder.query({
      query: () => ({
        url: '/Dashboard/monthly-purchases-chart',
        method: 'GET',
      }),
    }),

    getMonthlyProfitChart: builder.query({
      query: () => ({
        url: '/Dashboard/monthly-profit-chart',
        method: 'GET',
      }),
    }),

    getSalesTrend: builder.query({
      query: () => ({
        url: '/Dashboard/sales-trend',
        method: 'GET',
      }),
    }),

    getDashboardOverview: builder.query({
      query: () => ({
        url: '/Dashboard/overview',
        method: 'GET',
      }),
    }),

    getCashFlowTrend: builder.query({
      query: () => ({
        url: '/Dashboard/cashflow-trend',
        method: 'GET',
      }),
    }),

    getProfitTrend: builder.query({
      query: () => ({
        url: '/Dashboard/profit-trend',
        method: 'GET',
      }),
    }),
  }),

  overrideExisting: false,
})

export const {
  useGetDashboardSummaryQuery,
  useGetRecentSalesQuery,
  useGetRecentPurchasesQuery,
  useGetTopProductsQuery,
  useGetTopCustomersQuery,
  useGetTopSuppliersQuery,
  useGetMonthlySalesChartQuery,
  useGetMonthlyPurchasesChartQuery,
  useGetMonthlyProfitChartQuery,
  useGetSalesTrendQuery,
  useGetDashboardOverviewQuery,
  useGetCashFlowTrendQuery,
  useGetProfitTrendQuery,
} = dashboardApi