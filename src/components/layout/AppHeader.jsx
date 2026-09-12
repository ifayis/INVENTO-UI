import {
  Bell,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
} from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import UserMenu from '@/components/layout/UserMenu'
import { selectCurrentUser } from '@/features/auth/authSelectors'
import {
  useTheme,
} from '@/providers/ThemeProvider'

export default function AppHeader({
  onMenuClick,
  onCollapseClick,
  sidebarCollapsed,
}) {
  const user =
    useSelector(selectCurrentUser)

  const { theme, toggleTheme } =
    useTheme()

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
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <UserMenu />
      </div>
    </header>
  )
}