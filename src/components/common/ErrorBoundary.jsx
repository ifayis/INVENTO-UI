import { Component } from 'react'
import { RefreshCw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Invento application error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <RefreshCw className="h-6 w-6 text-destructive" />
          </div>

          <h1 className="text-xl font-semibold">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            An unexpected application error occurred. Please reload the page
            and try again.
          </p>

          {import.meta.env.DEV && this.state.error?.message && (
            <p className="mt-4 break-words rounded-md bg-muted p-3 text-left text-xs text-muted-foreground">
              {this.state.error.message}
            </p>
          )}

          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Reload application
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary