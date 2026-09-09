import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import { router } from '@/app/router'
import { ThemeProvider } from '@/providers/ThemeProvider'
import ErrorBoundary from '@/components/common/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <RouterProvider router={router} />

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