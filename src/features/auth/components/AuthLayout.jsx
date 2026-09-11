import { Link } from 'react-router-dom'
import { Boxes } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'

export default function AuthLayout({
  title,
  description,
  children,
  footer,
}) {
  const { isDark } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <Boxes className="h-6 w-6" />
            INVENTO
          </Link>

          <div className="max-w-lg">
            <h2 className="text-4xl font-bold tracking-tight">
              Business management,
              <br />
              simplified.
            </h2>

            <p className="mt-5 max-w-md text-primary-foreground/75">
              Manage products, inventory, sales,
              purchases, customers and finances from
              one powerful platform.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} INVENTO
          </p>
        </div>

        <div className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-xl font-bold"
              >
                <Boxes className="h-6 w-6" />
                INVENTO
              </Link>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
              <div className="mb-7">
                <h1 className="text-2xl font-bold tracking-tight">
                  {title}
                </h1>

                {description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>

              {children}
            </div>

            {footer && (
              <div className="mt-5 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}