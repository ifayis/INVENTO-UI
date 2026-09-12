import {
  Bell,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import LogoutButton from '@/features/auth/components/LogoutButton'
import { selectCurrentUser } from '@/features/auth/authSelectors'

export default function Header({
  onMenuClick,
  onCollapseClick,
  sidebarCollapsed,
}) {
  const user = useSelector(selectCurrentUser)

  const [userMenuOpen, setUserMenuOpen] =
    useState(false)

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email ||
    'Invento User'

  const role =
    user?.role || 'User'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
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
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Button>

        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-2 px-2 sm:px-3"
            onClick={() =>
              setUserMenuOpen(
                (value) => !value,
              )
            }
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="hidden text-left sm:block">
              <p className="max-w-32 truncate text-sm font-medium">
                {displayName}
              </p>

              <p className="text-xs text-muted-foreground">
                {role}
              </p>
            </div>

            <ChevronDown className="hidden h-4 w-4 sm:block" />
          </Button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-popover p-2 shadow-lg">
              <div className="border-b px-3 py-2">
                <p className="truncate text-sm font-medium">
                  {displayName}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <div className="pt-2">
                <LogoutButton
                  variant="ghost"
                  className="w-full justify-start"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}