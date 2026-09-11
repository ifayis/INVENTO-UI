import {
  createBrowserRouter,
} from 'react-router-dom'

import LandingPage from '@/pages/LandingPage'
import DashboardPage from '@/pages/DashboardPage'

import RegisterPage from '@/features/auth/pages/RegisterPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import ChangePasswordPage from '@/features/auth/pages/ChangePasswordPage'

import ProtectedRoute from '@/features/auth/components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <LandingPage />,
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
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },

      {
        path: '/change-password',
        element: <ChangePasswordPage />,
      },
    ],
  },
])