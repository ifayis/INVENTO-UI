import {
  ChevronRight,
  Home,
} from 'lucide-react'
import {
  Link,
  useLocation,
} from 'react-router-dom'

const labels = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  inventory: 'Inventory',
  targets: 'Targets',
  sales: 'Sales',
  purchases: 'Purchases',
  customers: 'Customers',
  suppliers: 'Suppliers',
  receivables: 'Receivables',
  payables: 'Payables',
  balance: 'Balance',
  profit: 'Profit',
  reports: 'Reports',
  company: 'Company',
  users: 'Users',
}

export default function Breadcrumbs() {
  const location = useLocation()

  const segments =
    location.pathname
      .split('/')
      .filter(Boolean)

  if (!segments.length) {
    return null
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6"
    >
      <ol className="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm">
        <li className="shrink-0">
          <Link
            to="/dashboard"
            className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Dashboard"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {segments.map(
          (segment, index) => {
            const path =
              '/' +
              segments
                .slice(
                  0,
                  index + 1,
                )
                .join('/')

            const label =
              labels[segment] ||
              segment
                .replace(
                  /-/g,
                  ' ',
                )
                .replace(
                  /\b\w/g,
                  (char) =>
                    char.toUpperCase(),
                )

            const isLast =
              index ===
              segments.length - 1

            return (
              <li
                key={path}
                className="flex min-w-0 items-center gap-1.5"
              >
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />

                {isLast ? (
                  <span className="truncate font-medium text-foreground">
                    {label}
                  </span>
                ) : (
                  <Link
                    to={path}
                    className="truncate text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                )}
              </li>
            )
          },
        )}
      </ol>
    </nav>
  )
}