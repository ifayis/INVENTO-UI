import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import { ThemeProvider } from '@/providers/ThemeProvider'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import AuthBootstrap from '@/features/auth/components/AuthBootstrap'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthBootstrap>
          <RouterProvider router={router} />
        </AuthBootstrap>

        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App