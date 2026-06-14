import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary that catches runtime errors in the component tree.
 * Prevents the entire app from crashing when a child component throws.
 * Displays a user-friendly fallback UI with error details in development.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("EcoTrace error boundary caught:", error, info);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          role="alert"
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "var(--space-8)",
            background: "var(--gray-50)",
          }}
        >
          <div
            style={{
              maxWidth: 480,
              textAlign: "center",
              background: "#fff",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-10)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>
              🌿
            </div>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--gray-900)",
                marginBottom: "var(--space-3)",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "var(--gray-500)",
                lineHeight: 1.6,
                marginBottom: "var(--space-6)",
              }}
            >
              EcoTrace hit an unexpected error. Your data is safe — try
              refreshing the page or resetting the app.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <pre
                style={{
                  textAlign: "left",
                  fontSize: "0.75rem",
                  background: "var(--gray-100)",
                  padding: "var(--space-4)",
                  borderRadius: "var(--radius-sm)",
                  overflowX: "auto",
                  marginBottom: "var(--space-6)",
                  color: "var(--gray-700)",
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <div
              style={{
                display: "flex",
                gap: "var(--space-3)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={this.handleReset}
                className="btn btn-primary"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-ghost"
              >
                Refresh page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
