import { Link } from 'react-router-dom'
import {
  KeyRound,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import LogoutButton from '@/features/auth/components/LogoutButton'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/features/auth/authSelectors'

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser)

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-5 rounded-xl border bg-card p-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Welcome back
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {user?.email || 'Invento User'}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Role: {user?.role || 'Unknown'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/change-password">
              <Button variant="outline">
                <KeyRound className="h-4 w-4" />
                Change password
              </Button>
            </Link>

            <LogoutButton />
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <LogOut className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Authentication is connected
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                The full Invento dashboard will replace this
                temporary protected page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}