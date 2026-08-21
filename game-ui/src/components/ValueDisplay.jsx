import React from 'react';
import { RefreshCw, AlertCircle, Sparkles, Send, Terminal } from 'lucide-react';

export function ValueDisplay({
  currentValue,
  status,
  lastFetchedAt,
  isBumping,
  fetchMode,
  setFetchMode,
  manualFetch,
  useMock,
}) {
  const isLoading = status === 'loading';

  return (
    <div className="glass-card hero-value-card">
      <div className="value-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Terminal size={14} color="var(--accent-cyan)" />
        <span>Full Raw Server Output</span>
      </div>

      <div className="hero-text-container">
        {currentValue !== null && currentValue !== undefined ? (
          <h5 className={`response-text-h5 ${isBumping ? 'bump' : ''}`}>
            {currentValue}
          </h5>
        ) : (
          <h5 className="response-text-h5 placeholder">
            {isLoading ? 'Fetching server response...' : 'Ready — click below to hit endpoint'}
          </h5>
        )}
      </div>

      {lastFetchedAt ? (
        <div className="timestamp-tag">
          Received at: {lastFetchedAt}
        </div>
      ) : (
        <div className="timestamp-tag">
          Endpoint: /backend/random
        </div>
      )}

      {status === 'error' && !useMock && (
        <div className="alert-box">
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div className="alert-title">Server Connection Error</div>
            <div>
              Could not reach <code>/backend/random</code>. Ensure the backend port-forward is running or toggle <strong>Demo Data</strong> above.
            </div>
          </div>
        </div>
      )}

      <div className="control-bar">
        <button
          className="btn btn-primary"
          onClick={manualFetch}
          disabled={isLoading}
          style={{ padding: '0.85rem 1.5rem', fontSize: '0.95rem' }}
        >
          {isLoading ? (
            <RefreshCw size={18} className="spin" />
          ) : (
            <Send size={18} />
          )}
          <span>{isLoading ? 'Hitting Server...' : 'Fetch Output Now'}</span>
        </button>
      </div>
    </div>
  );
}
