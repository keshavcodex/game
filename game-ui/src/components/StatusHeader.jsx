import React from 'react';
import { Activity, Server, Zap, RefreshCw, AlertCircle } from 'lucide-react';

export function StatusHeader({
  status,
  timeLeftMs,
  intervalMs,
  fetchMode,
  setFetchMode,
  useMock,
  setUseMock,
  consecutiveErrors,
}) {
  const progressPercent = Math.max(0, Math.min(100, (timeLeftMs / intervalMs) * 100));

  const getStatusBadge = () => {
    if (useMock) {
      return (
        <div className="endpoint-badge" style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}>
          <span className="pulse-dot warning"></span>
          <span>Mock Server Mode</span>
        </div>
      );
    }

    switch (status) {
      case 'online':
        return (
          <div className="endpoint-badge">
            <span className="pulse-dot"></span>
            <span>/backend/random</span>
          </div>
        );
      case 'loading':
        return (
          <div className="endpoint-badge" style={{ color: 'var(--accent-cyan)' }}>
            <span className="pulse-dot warning"></span>
            <span>Fetching...</span>
          </div>
        );
      case 'error':
        return (
          <div className="endpoint-badge" style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: 'var(--accent-rose)' }}>
            <span className="pulse-dot error"></span>
            <span>Server Offline / Unreachable</span>
          </div>
        );
      default:
        return (
          <div className="endpoint-badge" style={{ color: 'var(--text-muted)' }}>
            <span>Manual Mode Ready</span>
          </div>
        );
    }
  };

  return (
    <div className="glass-card header-card">
      <div className="header-top">
        <div className="brand-title">
          <div className="brand-icon">
            <Activity size={24} />
          </div>
          <div className="brand-text">
            <h1>Random Endpoint Monitor</h1>
            <p>Fetch outputs on-demand or configure periodic refreshes</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="header-controls-row">
        {/* Mode Selector Tabs */}
        <div className="mode-selector">
          <button
            className={`mode-tab ${fetchMode === 'manual' ? 'active' : ''}`}
            onClick={() => setFetchMode('manual')}
          >
            <Zap size={14} />
            <span>Manual Mode</span>
          </button>
          <button
            className={`mode-tab ${fetchMode === 'auto' ? 'active' : ''}`}
            onClick={() => setFetchMode('auto')}
          >
            <RefreshCw size={14} />
            <span>Auto Refresh (2s)</span>
          </button>
        </div>

        {/* Mock Mode Toggle */}
        <div className="mock-mode-bar" style={{ margin: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Server size={14} />
            <span>Demo Data:</span>
          </div>
          <label className="toggle-switch" title="Toggle Mock Server Mode">
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {consecutiveErrors >= 3 && (
        <div className="alert-box" style={{ marginTop: '0.5rem', padding: '0.6rem 0.85rem' }}>
          <AlertCircle size={16} />
          <span>Auto polling auto-paused after 3 connection errors to avoid spamming server.</span>
        </div>
      )}

      {fetchMode === 'auto' && (
        <div className="timer-container">
          <div className="timer-info">
            <span>Auto Polling Active</span>
            <span>Next fetch in: {(timeLeftMs / 1000).toFixed(1)}s</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${progressPercent}%`,
                transition: timeLeftMs === intervalMs ? 'none' : 'width 0.05s linear',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
