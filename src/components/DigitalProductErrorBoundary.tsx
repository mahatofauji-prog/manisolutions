import React, { Component } from 'react';
import { ShoppingBag, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onNavigateHome?: () => void;
  onNavigateStore?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class DigitalProductErrorBoundary extends Component<Props, State> {
  declare props: Props;
  state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('DigitalProductErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--theme-bg-secondary)] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#E4E1DA] p-8 shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-[#C79A22] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-[#171A1F]">Unable to Display Product</h2>
              <p className="text-xs text-[#626873] leading-relaxed">
                Something went wrong while rendering this digital product. You can reload this page or browse other products.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  (this as any).setState({ hasError: false });
                  window.location.reload();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#C79A22] hover:bg-[#B38A1E] text-[#171A1F] text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              {this.props.onNavigateStore && (
                <button
                  onClick={this.props.onNavigateStore}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#171A1F] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span>All Products</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
