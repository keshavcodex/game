import { useState, useEffect, useRef, useCallback } from 'react';

const ENDPOINT_PROXY = '/backend/random';
const DEFAULT_INTERVAL_MS = 2000;

export function useRandomFetcher(initialIntervalMs = DEFAULT_INTERVAL_MS) {
  const [currentValue, setCurrentValue] = useState(null);
  const [history, setHistory] = useState([]);
  const [fetchMode, setFetchMode] = useState('manual');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [useMock, setUseMock] = useState(false);
  const [isBumping, setIsBumping] = useState(false);
  const [intervalMs, setIntervalMs] = useState(initialIntervalMs);
  const [timeLeftMs, setTimeLeftMs] = useState(initialIntervalMs);
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);

  const mockRef = useRef(useMock);
  mockRef.current = useMock;

  const parseValueFromResponse = (textData) => {
    try {
      const parsed = JSON.parse(textData);
      if (typeof parsed === 'number') return parsed;
      if (typeof parsed === 'object' && parsed !== null) {
        if ('value' in parsed) return Number(parsed.value);
        if ('random' in parsed) return Number(parsed.random);
        if ('result' in parsed) return Number(parsed.result);
        if ('number' in parsed) return Number(parsed.number);
      }
    } catch {
      // Fallback
    }

    const match = textData.match(/-?\d+(\.\d+)?/);
    if (match) {
      return Number(match[0]);
    }
    return NaN;
  };

  const triggerBumpAnimation = () => {
    setIsBumping(true);
    setTimeout(() => setIsBumping(false), 300);
  };

  const fetchRandomNumber = useCallback(async () => {
    const timestamp = new Date().toLocaleTimeString();
    setStatus('loading');

    // If Mock Mode is enabled
    if (mockRef.current) {
      const mockVal = Math.floor(Math.random() * 1000) + 1;
      const fullText = `Random output generated: ${mockVal}`;
      setCurrentValue(fullText);
      setHistory((prev) => [{ val: fullText, num: mockVal, time: timestamp, id: Date.now() }, ...prev.slice(0, 49)]);
      setStatus('mock');
      setErrorMsg(null);
      setConsecutiveErrors(0);
      setLastFetchedAt(timestamp);
      triggerBumpAnimation();
      return;
    }

    try {
      const response = await fetch(ENDPOINT_PROXY, {
        headers: { 'Accept': 'application/json, text/plain, */*' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const entireText = await response.text();
      const numVal = parseValueFromResponse(entireText);

      setCurrentValue(entireText);
      setHistory((prev) => [{ val: entireText, num: numVal, time: timestamp, id: Date.now() }, ...prev.slice(0, 49)]);
      setStatus('online');
      setErrorMsg(null);
      setConsecutiveErrors(0);
      setLastFetchedAt(timestamp);
      triggerBumpAnimation();
    } catch (err) {
      console.warn('Failed to fetch through the /backend proxy:', err.message);
      setStatus('error');
      setErrorMsg(err.message || 'Unable to reach the backend through /backend');
      
      setConsecutiveErrors((prevCount) => {
        const newCount = prevCount + 1;
        if (newCount >= 3 && fetchMode === 'auto') {
          setFetchMode('manual');
        }
        return newCount;
      });
    }
  }, [fetchMode]);

  useEffect(() => {
    if (fetchMode !== 'auto') {
      setTimeLeftMs(intervalMs);
      return;
    }

    setTimeLeftMs(intervalMs);
    const tickInterval = 50;

    const countdownTimer = setInterval(() => {
      setTimeLeftMs((prev) => {
        if (prev <= tickInterval) {
          fetchRandomNumber();
          return intervalMs;
        }
        return prev - tickInterval;
      });
    }, tickInterval);

    return () => clearInterval(countdownTimer);
  }, [fetchMode, intervalMs, fetchRandomNumber]);

  const numericHistory = history
    .map((item) => Number(item.num))
    .filter((v) => !isNaN(v));

  const stats = {
    count: history.length,
    min: numericHistory.length ? Math.min(...numericHistory) : '--',
    max: numericHistory.length ? Math.max(...numericHistory) : '--',
    avg: numericHistory.length
      ? (numericHistory.reduce((a, b) => a + b, 0) / numericHistory.length).toFixed(1)
      : '--',
  };

  return {
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
    setIntervalMs,
    consecutiveErrors,
    stats,
    manualFetch: fetchRandomNumber,
    clearHistory: () => setHistory([]),
  };
}
