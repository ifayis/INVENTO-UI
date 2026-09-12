import {
  BarChart3,
  Boxes,
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileBarChart,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Target,
  Truck,
  Users,
  X,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '@/features/auth/authSelectors'

const navigationGroups = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
        permission: 'Dashboard',
      },
    ],
  },

  {
    title: 'Inventory',
    items: [
      {
        label: 'Products',
        path: '/products',
        icon: Package,
        permission: 'Products',
      },
      {
        label: 'Categories',
        path: '/categories',
        icon: Boxes,
        permission: 'Categories',
      },
      {
        label: 'Stock Movements',
        path: '/inventory',
        icon: Boxes,
        permission: 'StockMovements',
      },
      {
        label: 'Targets',
        path: '/targets',
        icon: Target,
        permission: 'Targets',
      },
    ],
  },

  {
    title: 'Sales & Purchases',
    items: [
      {
        label: 'Sales',
        path: '/sales',
        icon: ShoppingCart,
        permission: 'Sales',
      },
      {
        label: 'Purchases',
        path: '/purchases',
        icon: ClipboardList,
        permission: 'Purchases',
      },
      {
        label: 'Customers',
        path: '/customers',
        icon: Users,
        permission: 'Customers',
      },
      {
        label: 'Suppliers',
        path: '/suppliers',
        icon: Truck,
        permission: 'Suppliers',
      },
    ],
  },

  {
    title: 'Finance',
    items: [
      {
        label: 'Receivables',
        path: '/receivables',
        icon: CircleDollarSign,
        permission: 'Receivables',
      },
      {
        label: 'Payables',
        path: '/payables',
        icon: CircleDollarSign,
        permission: 'Payables',
      },
      {
        label: 'Balance',
        path: '/balance',
        icon: CircleDollarSign,
        permission: 'Balance',
      },
      {
        label: 'Profit',
        path: '/profit',
        icon: BarChart3,
        permission: 'Profit',
      },
    ],
  },

  {
    title: 'Reports',
    items: [
      {
        label: 'Reports',
        path: '/reports',
        icon: FileBarChart,
        permission: 'Reports',
      },
    ],
  },

  {
    title: 'Administration',
    items: [
      {
        label: 'Company',
        path: '/company',
        icon: Building2,
        permission: 'Company',
      },
      {
        label: 'Users',
        path: '/users',
        icon: Users,
        permission: 'Users',
      },
    ],
  },
]

export default function AppSidebar({
  open,
  collapsed,
  onClose,
  onToggleCollapse,
}) {
  const user = useSelector(selectCurrentUser)

  const permissions = user?.permissions || []

  const canAccess = (permission) =>
    permissions.includes(permission)

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card',
          'transition-[transform,width] duration-200 ease-in-out',
          open
            ? 'translate-x-0'
            : '-translate-x-full',
          'lg:static lg:translate-x-0',
          collapsed
            ? 'lg:w-20'
            : 'lg:w-64',
        ].join(' ')}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center border-b px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-lg font-bold tracking-tight">
                  INVENTO
                </p>

                <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Business Management
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-6">
            {navigationGroups.map(
              (group) => {
                const visibleItems =
                  group.items.filter(
                    (item) =>
                      canAccess(
                        item.permission,
                      ),
                  )

                if (!visibleItems.length) {
                  return null
                }

                return (
                  <div key={group.title}>
                    {!collapsed && (
                      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.title}
                      </p>
                    )}

                    <div className="space-y-1">
                      {visibleItems.map(
                        (item) => {
                          const Icon =
                            item.icon

                          return (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              onClick={
                                onClose
                              }
                              title={
                                collapsed
                                  ? item.label
                                  : undefined
                              }
                              className={({
                                isActive,
                              }) =>
                                [
                                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                                  'transition-colors duration-150',
                                  collapsed
                                    ? 'lg:justify-center'
                                    : '',
                                  isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                ].join(
                                  ' ',
                                )
                              }
                            >
                              <Icon className="h-5 w-5 shrink-0" />

                              {!collapsed && (
                                <span className="truncate">
                                  {
                                    item.label
                                  }
                                </span>
                              )}
                            </NavLink>
                          )
                        },
                      )}
                    </div>
                  </div>
                )
              },
            )}
          </div>
        </nav>

        {/* Collapse */}
        <div className="hidden shrink-0 border-t p-3 lg:block">
          <button
            type="button"
            onClick={
              onToggleCollapse
            }
            className="flex w-full items-center justify-center rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={
              collapsed
                ? 'Expand sidebar'
                : 'Collapse sidebar'
            }
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}