import {
  createBrowserRouter,
} from 'react-router-dom'

import LandingPage from '@/pages/LandingPage'
import DashboardPage from '@/pages/DashboardPage'

import LoginPage from '@/features/auth/pages/LoginPage'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'
import ChangePasswordPage from '@/features/auth/pages/ChangePasswordPage'

import ProtectedRoute from '@/features/auth/components/ProtectedRoute'

import AppLayout from '@/layouts/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },

  {
    path: '/login',
    element: <LoginPage />,
  },

  {
    path: '/register',
    element: <RegisterPage />,
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
        element: <AppLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
        ],
      },

      {
        path: '/change-password',
        element: <ChangePasswordPage />,
      },
    ],
  },
])