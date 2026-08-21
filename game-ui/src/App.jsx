import React from 'react';
import { useRandomFetcher } from './hooks/useRandomFetcher';
import { StatusHeader } from './components/StatusHeader';
import { ValueDisplay } from './components/ValueDisplay';
import { HistoryChart } from './components/HistoryChart';

export default function App() {
  const {
    currentValue,
    history,
    fetchMode,
    setFetchMode,
    status,
    errorMsg,
    lastFetchedAt,
    useMock,
    setUseMock,
    isBumping,
    timeLeftMs,
    intervalMs,
    consecutiveErrors,
    stats,
    manualFetch,
    clearHistory,
  } = useRandomFetcher(2000);

  return (
    <div className="app-container">
      <StatusHeader
        status={status}
        timeLeftMs={timeLeftMs}
        intervalMs={intervalMs}
        fetchMode={fetchMode}
        setFetchMode={setFetchMode}
        useMock={useMock}
        setUseMock={setUseMock}
        consecutiveErrors={consecutiveErrors}
      />

      <div className="main-grid">
        <ValueDisplay
          currentValue={currentValue}
          status={status}
          lastFetchedAt={lastFetchedAt}
          isBumping={isBumping}
          fetchMode={fetchMode}
          setFetchMode={setFetchMode}
          manualFetch={manualFetch}
          useMock={useMock}
        />

        <HistoryChart
          history={history}
          stats={stats}
          clearHistory={clearHistory}
        />
      </div>
    </div>
  );
}
