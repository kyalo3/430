import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-semibold text-emerald-950 mb-2">Something went wrong</h1>
          <p className="text-slate-600 mb-4">Please refresh the page. If the problem continues, contact support.</p>
          <button
            type="button"
            className="px-4 py-2 bg-emerald-700 text-white rounded"
            onClick={() => window.location.assign('/')}
          >
            Return home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
