import {
  Bell,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import UserMenu from '@/components/layout/UserMenu'
import { selectCurrentUser } from '@/features/auth/authSelectors'
import {
  useGetCriticalStockNotificationsQuery,
  useGetLowStockNotificationsQuery,
  useGetReorderNotificationsQuery,
  useGetReceivableNotificationsQuery,
  useGetPayableNotificationsQuery,
} from '@/features/notification/notificationsApi'
import {
  useTheme,
} from '@/providers/ThemeProvider'

export default function AppHeader({
  onMenuClick,
  onCollapseClick,
  sidebarCollapsed,
}) {
  const user = useSelector(selectCurrentUser)

  const navigate = useNavigate()

  const { theme, toggleTheme } =
    useTheme()

  const canViewTargets =
    user?.permissions?.includes('Targets')

  const canViewReceivables =
    user?.permissions?.includes('Receivables')

  const canViewPayables =
    user?.permissions?.includes('Payables')
  const {
    data: lowStockResponse,
  } = useGetLowStockNotificationsQuery(
    undefined,
    {
      skip: !canViewTargets,
      pollingInterval: 60000,
    },
  )

  const {
    data: criticalResponse,
  } = useGetCriticalStockNotificationsQuery(
    undefined,
    {
      skip: !canViewTargets,
      pollingInterval: 60000,
    },
  )

  const {
    data: reorderResponse,
  } = useGetReorderNotificationsQuery(
    undefined,
    {
      skip: !canViewTargets,
      pollingInterval: 60000,
    },
  )

  const {
    data: receivableResponse,
  } = useGetReceivableNotificationsQuery(
    undefined,
    {
      skip: !canViewReceivables,
      pollingInterval: 60000,
    },
  )

  const {
    data: payableResponse,
  } = useGetPayableNotificationsQuery(
    undefined,
    {
      skip: !canViewPayables,
      pollingInterval: 60000,
    },
  )

  /*
   * Extract API arrays
   */
  const lowStock = Array.isArray(
    lowStockResponse?.data,
  )
    ? lowStockResponse.data
    : []

  const criticalStock = Array.isArray(
    criticalResponse?.data,
  )
    ? criticalResponse.data
    : []

  const reorderProducts = Array.isArray(
    reorderResponse?.data,
  )
    ? reorderResponse.data
    : []

  const receivables = Array.isArray(
    receivableResponse?.data,
  )
    ? receivableResponse.data
    : []

  const payables = Array.isArray(
    payableResponse?.data,
  )
    ? payableResponse.data
    : []

  const criticalIds = new Set(
    criticalStock.map(
      (item) => item.productId,
    ),
  )

  const normalLowStock =
    lowStock.filter(
      (item) =>
        !criticalIds.has(item.productId),
    )

  const notificationCount =
    criticalStock.length +
    normalLowStock.length +
    reorderProducts.length +
    receivables.length +
    payables.length

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Mobile menu */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop sidebar toggle */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onCollapseClick}
          aria-label={
            sidebarCollapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>

        {/* Welcome user */}
        <div className="hidden min-w-0 md:block">
          <p className="truncate text-sm text-muted-foreground">
            Welcome back
          </p>

          <p className="truncate text-sm font-semibold">
            {user?.fullName ||
              user?.email ||
              'Invento User'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Theme */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
          onClick={() =>
            navigate('/notifications')
          }
        >
          <Bell className="h-5 w-5" />

          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-4 text-destructive-foreground">
              {notificationCount > 99
                ? '99+'
                : notificationCount}
            </span>
          )}
        </Button>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  )
}