import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded text-red-200">
          <h3 className="font-bold mb-2">Something went wrong</h3>
          <p className="text-sm font-mono">{this.state.error?.message}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 rounded text-white text-sm"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}
