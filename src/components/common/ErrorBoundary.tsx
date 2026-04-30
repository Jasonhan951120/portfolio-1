import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // In production, forward to an error reporting service (e.g. Sentry)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[200px] w-full flex flex-col items-center justify-center p-8 bg-rose-50 rounded-[32px] border border-rose-100 text-center">
          <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-rose-600" />
          </div>
          <h3 className="text-lg font-black text-rose-900 uppercase tracking-tight mb-2">
            Component Rendering Error
          </h3>
          <p className="text-xs text-rose-600 font-bold uppercase tracking-widest max-w-sm mb-6 leading-relaxed">
            {this.state.error?.message || "An unexpected error occurred while rendering this component."}
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
