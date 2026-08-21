import React from 'react';
import { History, Trash2, TrendingUp } from 'lucide-react';

export function HistoryChart({ history, stats, clearHistory }) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="section-title">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={18} color="var(--accent-cyan)" />
          <span>Real-time Analytics</span>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
            title="Clear history log"
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-label">Total</div>
          <div className="stat-val">{stats.count}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Min</div>
          <div className="stat-val">{stats.min}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Max</div>
          <div className="stat-val">{stats.max}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Avg</div>
          <div className="stat-val">{stats.avg}</div>
        </div>
      </div>

      <div className="history-section">
        <div className="section-title" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <History size={14} />
            <span>Recent Fetches</span>
          </div>
          <span>Showing last {history.length}</span>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '2rem 0', fontSize: '0.85rem' }}>
              Waiting for data from endpoint...
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item">
                <span className="history-val">{item.val}</span>
                <span className="history-time">{item.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
