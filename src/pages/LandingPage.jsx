import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Boxes,
  Check,
  ChevronRight,
  Menu,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/providers/ThemeProvider'

const features = [
  {
    icon: Package,
    title: 'Product & Inventory',
    description:
      'Track products, stock levels, movements, categories and low-stock items from one place.',
  },
  {
    icon: ShoppingCart,
    title: 'Sales & Purchases',
    description:
      'Manage sales, purchases, customers, suppliers and transaction history efficiently.',
  },
  {
    icon: BarChart3,
    title: 'Reports & Analytics',
    description:
      'Turn your business data into clear dashboards, trends and actionable reports.',
  },
  {
    icon: TrendingUp,
    title: 'Profit & Finance',
    description:
      'Monitor revenue, expenses, profit, receivables, payables and cash flow.',
  },
  {
    icon: Users,
    title: 'Customer Management',
    description:
      'Keep customer information, ledgers, sales history and outstanding balances organized.',
  },
  {
    icon: Boxes,
    title: 'Multi-Tenant SaaS',
    description:
      'Keep each business securely isolated while providing a unified management experience.',
  },
]

const stats = [
  ['Inventory', 'Real-time stock visibility'],
  ['Sales', 'Complete sales tracking'],
  ['Finance', 'Profit & cash flow'],
]

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-2xl">
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
      </div>

      <div className="grid min-h-[360px] grid-cols-[90px_1fr] sm:grid-cols-[150px_1fr]">
        <div className="border-r bg-muted/30 p-3">
          <div className="mb-6 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-primary" />
            <span className="hidden text-sm font-bold sm:block">
              INVENTO
            </span>
          </div>

          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className={`h-8 rounded-md ${
                  item === 1 ? 'bg-primary/10' : 'bg-muted/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-5">
            <div className="h-5 w-32 rounded bg-muted" />
            <div className="mt-2 h-3 w-48 rounded bg-muted/60" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Sales', '₹1,24,500'],
              ['Purchases', '₹68,200'],
              ['Profit', '₹56,300'],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border bg-background p-4"
              >
                <div className="text-xs text-muted-foreground">
                  {label}
                </div>

                <div className="mt-2 text-lg font-bold">
                  {value}
                </div>

                <div className="mt-2 h-1.5 w-16 rounded-full bg-primary/20">
                  <div className="h-full w-10 rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-3 w-16 rounded bg-muted/60" />
            </div>

            <div className="flex h-40 items-end gap-2 sm:gap-4">
              {[38, 55, 44, 72, 62, 82, 68, 92, 76, 96].map(
                (height, index) => (
                  <motion.div
                    key={index}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.05,
                    }}
                    className="flex-1 rounded-t bg-primary/70"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toggleTheme, isDark } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Boxes className="h-5 w-5" />
            </span>

            <span className="text-lg tracking-tight">
              INVENTO
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? 'Light' : 'Dark'}
            </button>

            <Link to="/login">
              <Button variant="ghost">
                Sign in
              </Button>
            </Link>

            <Link to="/login">
              <Button>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </nav>

          <button
            type="button"
            className="rounded-md p-2 md:hidden"
            onClick={() =>
              setMobileMenuOpen((value) => !value)
            }
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                Features
              </a>

              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm hover:bg-muted"
              >
                About
              </a>

              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
              >
                {isDark
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'}
              </button>

              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button className="mt-2 w-full">
                  Sign in
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <main>
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-28 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 text-xs font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Modern business management platform
                </div>

                <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Run your business
                  <span className="text-primary">
                    {' '}
                    smarter.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Manage inventory, sales, purchases, customers,
                  suppliers and finances from one powerful
                  business management platform.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/login">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Start managing your business
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <a href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Explore features
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </a>
                </div>

                <div className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t pt-6">
                  {stats.map(([title, description]) => (
                    <div key={title}>
                      <div className="text-sm font-semibold">
                        {title}
                      </div>

                      <div className="mt-1 text-xs leading-4 text-muted-foreground">
                        {description}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <DashboardPreview />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-y bg-muted/20"
        >
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-primary">
                EVERYTHING IN ONE PLACE
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to run your business
              </h2>

              <p className="mt-4 text-muted-foreground">
                Invento brings your everyday business operations
                together into one simple and powerful workspace.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon

                return (
                  <motion.div
                    key={feature.title}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      margin: '-50px',
                    }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.05,
                    }}
                    className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* About / CTA */}
        <section id="about">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-10 lg:px-16 lg:py-16">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    One platform. Complete business visibility.
                  </h2>

                  <p className="mt-4 max-w-xl text-primary-foreground/75">
                    Spend less time switching between tools and
                    more time growing your business with a
                    centralized management platform.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    'Inventory tracking',
                    'Sales management',
                    'Purchase management',
                    'Financial tracking',
                    'Business reports',
                    'Customer & supplier management',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 border-t border-primary-foreground/15 pt-8">
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="secondary"
                  >
                    Get started with Invento
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold"
          >
            <Boxes className="h-5 w-5 text-primary" />
            INVENTO
          </Link>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Invento. All rights
            reserved.
          </p>

          <Link
            to="/login"
            className="text-sm font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  )
}