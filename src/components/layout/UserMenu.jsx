import {
  ChevronDown,
  KeyRound,
  LogOut,
  UserCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import LogoutButton from '@/features/auth/components/LogoutButton'
import { selectCurrentUser } from '@/features/auth/authSelectors'

export default function UserMenu() {
  const user = useSelector(selectCurrentUser)

  const [open, setOpen] = useState(false)

  const displayName =
    user?.fullName ||
    user?.email ||
    'Invento User'

  const role = user?.role || 'User'

  const initials =
    displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join('') || 'U'

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        className="gap-2 px-2 sm:px-3"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {initials}
        </div>

        <div className="hidden max-w-40 text-left sm:block">
          <p className="truncate text-sm font-medium">
            {displayName}
          </p>

          <p className="truncate text-xs capitalize text-muted-foreground">
            {role}
          </p>
        </div>

        <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
      </Button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close user menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border bg-popover p-2 text-popover-foreground shadow-lg"
          >
            <div className="border-b px-3 py-3">
              <p className="truncate text-sm font-semibold">
                {displayName}
              </p>

              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {user?.email}
              </p>

              <p className="mt-2 inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium capitalize">
                {role}
              </p>
            </div>

            <div className="space-y-1 pt-2">
              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <UserCircle className="h-4 w-4" />
                Profile
              </Link>

              <Link
                to="/change-password"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted"
              >
                <KeyRound className="h-4 w-4" />
                Change password
              </Link>

              <div className="border-t pt-1">
                <LogoutButton
                  variant="ghost"
                  className="w-full justify-start gap-3 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}