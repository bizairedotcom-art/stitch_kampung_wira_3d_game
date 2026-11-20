import React from 'react';

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || 'Ralat tidak dijangka berlaku.' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF8F6] flex items-center justify-center p-6">
          <div className="panel-chengal rounded-3xl max-w-md w-full p-6 text-center space-y-4">
            <div className="text-5xl">🛠️</div>
            <h1 className="font-display font-black text-2xl text-[#351000]">Alamak! Ada Gangguan Kecil</h1>
            <p className="text-sm text-[#78350F]">{this.state.message}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.href = '/village';
              }}
              className="btn-toy btn-toy-emerald w-full rounded-2xl font-display font-bold"
            >
              Kembali ke Kampung Wira
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
