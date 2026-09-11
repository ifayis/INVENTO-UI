import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from '@/features/auth/pages/LoginPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'

function HomeRedirect() {
  return <Navigate to="/login" replace />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeRedirect />,
  },

  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },

  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },

  {
    path: '*',
    element: <HomeRedirect />,
  },
])