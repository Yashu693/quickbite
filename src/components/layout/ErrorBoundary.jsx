import { Component } from 'react';
import { QBLogo } from '../common/QBLogo';

/**
 * ErrorBoundary — catches render errors and shows a branded fallback UI.
 * Prevents a single component crash from white-screening the entire app.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #0A0608 0%, #1A0A10 50%, #0E0812 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '0 32px', textAlign: 'center', color: '#fff',
        }}>
          <QBLogo size={56} style={{ borderRadius: 18, boxShadow: '0 10px 30px rgba(255,107,53,.4)', marginBottom: 22 }} />
          <div style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Sora',sans-serif", marginBottom: 8, letterSpacing: -.5 }}>
            Oops! Something broke
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginBottom: 6, lineHeight: 1.6 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,107,53,.6)', marginBottom: 28 }}>
            Don't worry — your cart & orders are safe
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '14px 28px', borderRadius: 16, border: 'none',
                background: 'linear-gradient(135deg,#FF6B35,#FF3D60)', color: '#fff',
                fontSize: 14, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(255,107,53,.42)',
              }}
            >
              🔄 Reload App
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.history.back(); }}
              style={{
                padding: '14px 28px', borderRadius: 16,
                border: '1px solid rgba(255,255,255,.15)',
                background: 'rgba(255,255,255,.06)', color: 'rgba(255,255,255,.75)',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              ← Go Back
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
