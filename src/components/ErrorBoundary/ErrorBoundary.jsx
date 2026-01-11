import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    // this.logErrorToService(error, errorInfo);
  }

  logErrorToService = (error, errorInfo) => {
    // Implementation for error logging service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
          <div className="max-w-md w-full">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="card-title text-error justify-center mb-2">
                  Something went wrong
                </h2>
                <p className="text-base-content/70 mb-4">
                  We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
                </p>
                
                {import.meta.env.DEV && this.state.error && (
                  <div className="collapse collapse-arrow bg-base-200 mb-4">
                    <input type="checkbox" />
                    <div className="collapse-title text-sm font-medium">
                      Error Details (Development)
                    </div>
                    <div className="collapse-content">
                      <div className="text-xs text-left bg-base-300 p-3 rounded overflow-auto max-h-40">
                        <strong>Error:</strong> {this.state.error.toString()}
                        <br />
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap mt-2">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-actions justify-center gap-2">
                  <button 
                    className="btn btn-primary"
                    onClick={this.handleRetry}
                  >
                    Try Again
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-base-300">
                  <p className="text-xs text-base-content/50">
                    Error ID: {Date.now().toString(36)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;