import { createBrowserRouter, Navigate } from 'react-router-dom'

function FoundationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Invento
        </h1>

        <p className="mt-2 text-muted-foreground">
          Frontend foundation is ready.
        </p>
      </div>
    </main>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <FoundationPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])