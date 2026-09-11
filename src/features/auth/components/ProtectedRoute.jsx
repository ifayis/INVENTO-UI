import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '@/features/auth/authSelectors'

export default function ProtectedRoute({
  permission,
}) {
  const location = useLocation()

  const isAuthenticated =
    useSelector(selectIsAuthenticated)

  const user =
    useSelector(selectCurrentUser)

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    )
  }

  if (
    permission &&
    !user?.permissions?.includes(permission)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  return <Outlet />
}