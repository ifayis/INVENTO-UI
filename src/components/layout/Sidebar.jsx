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
  Truck,
  Users,
  X,
} from 'lucide-react'

import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectCurrentUser } from '@/features/auth/authSelectors'

const navigation = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    permission: 'Dashboard',
  },
  {
    label: 'Products',
    icon: Package,
    path: '/products',
    permission: 'Products',
  },
  {
    label: 'Categories',
    icon: Boxes,
    path: '/categories',
    permission: 'Categories',
  },
  {
    label: 'Customers',
    icon: Users,
    path: '/customers',
    permission: 'Customers',
  },
  {
    label: 'Suppliers',
    icon: Truck,
    path: '/suppliers',
    permission: 'Suppliers',
  },
  {
    label: 'Sales',
    icon: ShoppingCart,
    path: '/sales',
    permission: 'Sales',
  },
  {
    label: 'Purchases',
    icon: ClipboardList,
    path: '/purchases',
    permission: 'Purchases',
  },
  {
    label: 'Inventory',
    icon: Boxes,
    path: '/inventory',
    permission: 'StockMovements',
  },
  {
    label: 'Finance',
    icon: CircleDollarSign,
    path: '/finance',
    permission: 'Balance',
  },
  {
    label: 'Profit',
    icon: BarChart3,
    path: '/profit',
    permission: 'Profit',
  },
  {
    label: 'Reports',
    icon: FileBarChart,
    path: '/reports',
    permission: 'Reports',
  },
  {
    label: 'Company',
    icon: Building2,
    path: '/company',
    permission: 'Company',
  },
  {
    label: 'Users',
    icon: Users,
    path: '/users',
    permission: 'Users',
  },
]

export default function Sidebar({
  open,
  collapsed,
  onClose,
}) {
  const user = useSelector(selectCurrentUser)

  const permissions =
    user?.permissions || []

  const visibleNavigation =
    navigation.filter((item) =>
      permissions.includes(item.permission),
    )

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
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card transition-transform duration-200',
          open
            ? 'translate-x-0'
            : '-translate-x-full',
          'lg:static lg:translate-x-0',
          collapsed
            ? 'lg:w-20'
            : 'lg:w-64',
        ].join(' ')}
      >
        <div className="flex h-16 items-center border-b px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </div>

            {!collapsed && (
              <span className="truncate text-lg font-bold tracking-tight">
                INVENTO
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {visibleNavigation.map(
              (item) => {
                const Icon = item.icon

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    title={
                      collapsed
                        ? item.label
                        : undefined
                    }
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        collapsed
                          ? 'lg:justify-center'
                          : '',
                      ].join(' ')
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />

                    {!collapsed && (
                      <span>
                        {item.label}
                      </span>
                    )}
                  </NavLink>
                )
              },
            )}
          </div>
        </nav>

        <div className="hidden border-t p-3 lg:block">
          <button
            type="button"
            onClick={() =>
              onClose?.()
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