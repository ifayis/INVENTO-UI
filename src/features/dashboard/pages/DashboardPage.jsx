import {
  Activity,
  AlertTriangle,
  Banknote,
  Boxes,
  CircleDollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  WalletCards,
} from 'lucide-react'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

import StatCard from '@/features/dashboard/components/StatCard'
import DashboardSection from '@/features/dashboard/components/DashboardSection'
import ChartCard from '@/features/dashboard/components/ChartCard'
import RankingList from '@/features/dashboard/components/RankingList'
import RecentTransactions from '@/features/dashboard/components/RecentTransactions'
import DashboardError from '@/features/dashboard/components/DashboardError'

import {
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
} from '@/features/dashboard/dashboardApi'

function formatCurrency(value) {
  return new Intl.NumberFormat(
    'en-IN',
    {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    },
  ).format(Number(value || 0))
}

function formatNumber(value) {
  return new Intl.NumberFormat(
    'en-IN',
  ).format(Number(value || 0))
}

function formatMonth(year, month) {
  return new Intl.DateTimeFormat(
    'en-IN',
    {
      month: 'short',
      year: 'numeric',
    },
  ).format(
    new Date(
      Number(year),
      Number(month) - 1,
      1,
    ),
  )
}

function getApiData(response) {
  return response?.data ?? null
}

function getApiList(response) {
  return Array.isArray(response?.data)
    ? response.data
    : []
}

function ChartTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
      <p className="mb-2 text-sm font-medium">
        {label}
      </p>

      <div className="space-y-1">
        {payload.map((entry) => (
          <p
            key={entry.dataKey}
            className="text-xs"
          >
            <span className="font-medium">
              {entry.name}:
            </span>{' '}
            {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const summaryQuery =
    useGetDashboardSummaryQuery()

  const overviewQuery =
    useGetDashboardOverviewQuery()

  const recentSalesQuery =
    useGetRecentSalesQuery(5)

  const recentPurchasesQuery =
    useGetRecentPurchasesQuery(5)

  const topProductsQuery =
    useGetTopProductsQuery(5)

  const topCustomersQuery =
    useGetTopCustomersQuery(5)

  const topSuppliersQuery =
    useGetTopSuppliersQuery(5)

  const monthlySalesQuery =
    useGetMonthlySalesChartQuery()

  const monthlyPurchasesQuery =
    useGetMonthlyPurchasesChartQuery()

  const monthlyProfitQuery =
    useGetMonthlyProfitChartQuery()

  const salesTrendQuery =
    useGetSalesTrendQuery()

  const cashFlowQuery =
    useGetCashFlowTrendQuery()

  const profitTrendQuery =
    useGetProfitTrendQuery()

  const summary =
    getApiData(summaryQuery.data)

  const overview =
    getApiData(overviewQuery.data)

  const recentSales =
    getApiList(recentSalesQuery.data)

  const recentPurchases =
    getApiList(
      recentPurchasesQuery.data,
    )

  const topProducts =
    getApiList(topProductsQuery.data)

  const topCustomers =
    getApiList(topCustomersQuery.data)

  const topSuppliers =
    getApiList(topSuppliersQuery.data)

  const monthlySales =
    getApiList(monthlySalesQuery.data)

  const monthlyPurchases =
    getApiList(
      monthlyPurchasesQuery.data,
    )

  const monthlyProfit =
    getApiList(
      monthlyProfitQuery.data,
    )

  const salesTrend =
    getApiList(salesTrendQuery.data)

  const cashFlow =
    getApiList(cashFlowQuery.data)

  const profitTrend =
    getApiList(profitTrendQuery.data)

  const monthlyChartData = useMemo(() => {
    const map = new Map()

    monthlySales.forEach((item) => {
      const key = `${item.year}-${item.month}`

      map.set(key, {
        key,
        month: formatMonth(
          item.year,
          item.month,
        ),
        sales: Number(item.amount || 0),
        purchases: 0,
        profit: 0,
      })
    })

    monthlyPurchases.forEach((item) => {
      const key = `${item.year}-${item.month}`

      const existing =
        map.get(key) || {
          key,
          month: formatMonth(
            item.year,
            item.month,
          ),
          sales: 0,
          purchases: 0,
          profit: 0,
        }

      existing.purchases =
        Number(item.amount || 0)

      map.set(key, existing)
    })

    monthlyProfit.forEach((item) => {
      const key = `${item.year}-${item.month}`

      const existing =
        map.get(key) || {
          key,
          month: formatMonth(
            item.year,
            item.month,
          ),
          sales: 0,
          purchases: 0,
          profit: 0,
        }

      existing.profit =
        Number(item.amount || 0)

      map.set(key, existing)
    })

    return Array.from(map.values())
      .sort((a, b) =>
        a.key.localeCompare(b.key),
      )
  }, [
    monthlySales,
    monthlyPurchases,
    monthlyProfit,
  ])

  const dashboardHasError =
    summaryQuery.isError &&
    overviewQuery.isError

  const isInitialLoading =
    summaryQuery.isLoading &&
    overviewQuery.isLoading

  if (
    dashboardHasError &&
    !summary &&
    !overview
  ) {
    return (
      <DashboardError
        message="Unable to load the dashboard."
        onRetry={() => {
          summaryQuery.refetch()
          overviewQuery.refetch()
        }}
      />
    )
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-primary">
              Business overview
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Monitor sales, purchases, profit,
              cash flow and inventory health.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              summaryQuery.refetch()
              overviewQuery.refetch()
              recentSalesQuery.refetch()
              recentPurchasesQuery.refetch()
              topProductsQuery.refetch()
              topCustomersQuery.refetch()
              topSuppliersQuery.refetch()
              monthlySalesQuery.refetch()
              monthlyPurchasesQuery.refetch()
              monthlyProfitQuery.refetch()
              salesTrendQuery.refetch()
              cashFlowQuery.refetch()
              profitTrendQuery.refetch()
            }}
            className="inline-flex items-center justify-center rounded-lg border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Refresh
          </button>
        </div>
      </motion.div>

      <DashboardSection
        title="Business snapshot"
        description="Your most important business metrics."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Sales"
            value={summary?.totalSales}
            icon={ShoppingCart}
            loading={
              isInitialLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Total Purchases"
            value={summary?.totalPurchases}
            icon={Package}
            loading={
              isInitialLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Current Balance"
            value={summary?.currentBalance}
            icon={WalletCards}
            loading={
              isInitialLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Total Products"
            value={summary?.totalProducts}
            icon={Boxes}
            loading={
              isInitialLoading
            }
            formatter={formatNumber}
          />

          <StatCard
            title="Customers"
            value={summary?.totalCustomers}
            icon={Users}
            loading={
              isInitialLoading
            }
            formatter={formatNumber}
          />

          <StatCard
            title="Suppliers"
            value={summary?.totalSuppliers}
            icon={Users}
            loading={
              isInitialLoading
            }
            formatter={formatNumber}
          />

          <StatCard
            title="Low Stock"
            value={summary?.lowStockProducts}
            icon={AlertTriangle}
            description="Products at or below low-stock threshold."
            loading={
              isInitialLoading
            }
            formatter={formatNumber}
          />

          <StatCard
            title="Critical Stock"
            value={overview?.criticalStockProducts}
            icon={Activity}
            description="Products at or below critical threshold."
            loading={
              overviewQuery.isLoading
            }
            formatter={formatNumber}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        title="Current business health"
        description="Today's and this month's operational position."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's Sales"
            value={overview?.todaySales}
            icon={CircleDollarSign}
            loading={
              overviewQuery.isLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Monthly Sales"
            value={overview?.monthlySales}
            icon={TrendingUp}
            loading={
              overviewQuery.isLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Monthly Profit"
            value={overview?.monthlyProfit}
            icon={Banknote}
            loading={
              overviewQuery.isLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Monthly Purchases"
            value={overview?.monthlyPurchases}
            icon={ShoppingCart}
            loading={
              overviewQuery.isLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Receivables"
            value={
              overview?.outstandingReceivables
            }
            icon={Users}
            loading={
              overviewQuery.isLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Payables"
            value={
              overview?.outstandingPayables
            }
            icon={Package}
            loading={
              overviewQuery.isLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Cash Balance"
            value={overview?.cashBalance}
            icon={WalletCards}
            loading={
              overviewQuery.isLoading
            }
            formatter={formatCurrency}
          />

          <StatCard
            title="Low Stock Products"
            value={overview?.lowStockProducts}
            icon={AlertTriangle}
            loading={
              overviewQuery.isLoading
            }
            formatter={formatNumber}
          />
        </div>
      </DashboardSection>

      <DashboardSection
        title="Financial performance"
        description="Monthly sales, purchases and profit."
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <ChartCard
            title="Monthly financial performance"
            description="Sales, purchases and profit by month."
            loading={
              monthlySalesQuery.isLoading ||
              monthlyPurchasesQuery.isLoading ||
              monthlyProfitQuery.isLoading
            }
            error={
              monthlySalesQuery.isError ||
              monthlyPurchasesQuery.isError ||
              monthlyProfitQuery.isError
            }
            onRetry={() => {
              monthlySalesQuery.refetch()
              monthlyPurchasesQuery.refetch()
              monthlyProfitQuery.refetch()
            }}
          >
            {monthlyChartData.length ? (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <BarChart
                  data={monthlyChartData}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      `₹${Number(
                        value,
                      ).toLocaleString(
                        'en-IN',
                      )}`
                    }
                  />

                  <Tooltip
                    content={
                      <ChartTooltip />
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="sales"
                    name="Sales"
                    fill="currentColor"
                    className="text-primary"
                    radius={[
                      4,
                      4,
                      0,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="purchases"
                    name="Purchases"
                    fill="currentColor"
                    className="text-muted-foreground"
                    radius={[
                      4,
                      4,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
                No monthly financial data available.
              </div>
            )}
          </ChartCard>

          <ChartCard
            title="Sales and profit trend"
            description="Historical sales revenue and profit."
            loading={
              salesTrendQuery.isLoading
            }
            error={
              salesTrendQuery.isError
            }
            onRetry={
              salesTrendQuery.refetch
            }
          >
            {salesTrend.length ? (
              <ResponsiveContainer
                width="100%"
                height={320}
              >
                <LineChart
                  data={salesTrend}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />

                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip />
                    }
                  />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="salesAmount"
                    name="Sales"
                    stroke="currentColor"
                    className="text-primary"
                    strokeWidth={2}
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="profitAmount"
                    name="Profit"
                    stroke="currentColor"
                    className="text-foreground"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
                No sales trend data available.
              </div>
            )}
          </ChartCard>
        </div>
      </DashboardSection>

      <DashboardSection
        title="Cash flow"
        description="Monthly money coming into and leaving the business."
      >
        <ChartCard
          title="Cash flow trend"
          description="Cash in, cash out and net cash flow."
          loading={
            cashFlowQuery.isLoading
          }
          error={
            cashFlowQuery.isError
          }
          onRetry={
            cashFlowQuery.refetch
          }
        >
          {cashFlow.length ? (
            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <AreaChart
                data={cashFlow}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  content={
                    <ChartTooltip />
                  }
                />

                <Legend />

                <Area
                  type="monotone"
                  dataKey="cashIn"
                  name="Cash In"
                  fill="currentColor"
                  stroke="currentColor"
                  className="text-primary"
                  fillOpacity={0.12}
                />

                <Area
                  type="monotone"
                  dataKey="cashOut"
                  name="Cash Out"
                  fill="currentColor"
                  stroke="currentColor"
                  className="text-muted-foreground"
                  fillOpacity={0.08}
                />

                <Line
                  type="monotone"
                  dataKey="netCashFlow"
                  name="Net Cash Flow"
                  stroke="currentColor"
                  className="text-foreground"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
              No cash-flow data available.
            </div>
          )}
        </ChartCard>
      </DashboardSection>

      <DashboardSection
        title="Profit analysis"
        description="Revenue, profit and margin over time."
      >
        <ChartCard
          title="Profit trend"
          description="Monthly revenue, profit and profit margin."
          loading={
            profitTrendQuery.isLoading
          }
          error={
            profitTrendQuery.isError
          }
          onRetry={
            profitTrendQuery.refetch
          }
        >
          {profitTrend.length ? (
            <ResponsiveContainer
              width="100%"
              height={320}
            >
              <LineChart
                data={profitTrend}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  yAxisId="amount"
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  yAxisId="margin"
                  orientation="right"
                  tick={{
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    `${value}%`
                  }
                />

                <Tooltip
                  content={
                    <ChartTooltip />
                  }
                />

                <Legend />

                <Line
                  yAxisId="amount"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  yAxisId="amount"
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="currentColor"
                  className="text-foreground"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  yAxisId="margin"
                  type="monotone"
                  dataKey="profitMargin"
                  name="Profit Margin %"
                  stroke="currentColor"
                  className="text-muted-foreground"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[320px] items-center justify-center text-sm text-muted-foreground">
              No profit trend data available.
            </div>
          )}
        </ChartCard>
      </DashboardSection>

      <DashboardSection
        title="Recent activity"
        description="Latest sales and purchases."
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Recent sales
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Latest sales transactions.
                </p>
              </div>

              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </div>

            <RecentTransactions
              items={recentSales}
              type="sale"
              loading={
                recentSalesQuery.isLoading
              }
            />
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  Recent purchases
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Latest purchase transactions.
                </p>
              </div>

              <Package className="h-5 w-5 text-muted-foreground" />
            </div>

            <RecentTransactions
              items={recentPurchases}
              type="purchase"
              loading={
                recentPurchasesQuery.isLoading
              }
            />
          </div>
        </div>
      </DashboardSection>

      <DashboardSection
        title="Top performers"
        description="Your strongest products, customers and suppliers."
      >
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="font-semibold">
                Top products
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by quantity sold.
              </p>
            </div>

            <RankingList
              items={topProducts}
              type="product"
              loading={
                topProductsQuery.isLoading
              }
            />
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="font-semibold">
                Top customers
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by total spending.
              </p>
            </div>

            <RankingList
              items={topCustomers}
              type="customer"
              loading={
                topCustomersQuery.isLoading
              }
            />
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="font-semibold">
                Top suppliers
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Ranked by purchase amount.
              </p>
            </div>

            <RankingList
              items={topSuppliers}
              type="supplier"
              loading={
                topSuppliersQuery.isLoading
              }
            />
          </div>
        </div>
      </DashboardSection>
    </div>
  )
}