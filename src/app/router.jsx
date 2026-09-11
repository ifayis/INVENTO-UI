import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/features/auth/pages/LoginPage'
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage'

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
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },

  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
])