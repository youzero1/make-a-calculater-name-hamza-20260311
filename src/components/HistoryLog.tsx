'use client';

import { useState, useEffect, useCallback } from 'react';

interface HistoryItem {
  id: number;
  type: string;
  input: string;
  result: string;
  createdAt: string;
}

const typeLabels: Record<string, { label: string; icon: string; color: string }> = {
  check: { label: 'Prime Check', icon: '🔍', color: 'bg-purple-100 text-purple-700' },
  generate: { label: 'Generate', icon: '📋', color: 'bg-blue-100 text-blue-700' },
  nth: { label: 'Nth Prime', icon: '🎯', color: 'bg-orange-100 text-orange-700' },
  factorize: { label: 'Factorize', icon: '🧮', color: 'bg-teal-100 text-teal-700' },
};

function formatResult(type: string, result: string): string {
  try {
    if (type === 'check') {
      return result === 'true' ? '✅ Prime' : '❌ Not Prime';
    }
    if (type === 'generate') {
      const arr = JSON.parse(result) as number[];
      if (arr.length === 0) return 'No primes found';
      if (arr.length <= 8) return arr.join(', ');
      return `${arr.slice(0, 8).join(', ')} ... (${arr.length} total)`;
    }
    if (type === 'nth') {
      return `Prime: ${result}`;
    }
    if (type === 'factorize') {
      const arr = JSON.parse(result) as number[];
      return arr.join(' × ');
    }
  } catch {
    return result;
  }
  return result;
}

export default function HistoryLog() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/history?limit=50');
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to load history');
        return;
      }
      setHistory(data.calculations);
    } catch {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClear = async () => {
    if (!confirm('Clear all calculation history?')) return;
    setClearing(true);
    try {
      await fetch('/api/history', { method: 'DELETE' });
      setHistory([]);
    } catch {
      setError('Failed to clear history');
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors"
        >
          <span>📜 Calculation History</span>
          <span className="text-slate-400 text-sm transition-transform duration-200" style={{ display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </button>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={handleClear}
              disabled={clearing}
              className="btn-secondary text-sm py-1 px-3"
            >
              {clearing ? 'Clearing...' : 'Clear All'}
            </button>
          )}
          <button
            onClick={fetchHistory}
            disabled={loading}
            className="btn-secondary text-sm py-1 px-3"
          >
            {loading ? '...' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {open && (
        <div>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm mb-3">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8 text-slate-400">
              <div className="text-2xl mb-2">⏳</div>
              <div>Loading history...</div>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <div className="text-3xl mb-2">📭</div>
              <div>No calculations yet. Start calculating!</div>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {history.map((item) => {
                const meta = typeLabels[item.type] || { label: item.type, icon: '📌', color: 'bg-gray-100 text-gray-700' };
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:w-36">
                      <span className="text-lg">{meta.icon}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                        {meta.label}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-slate-700">
                        <span className="font-medium">Input:</span> {item.input}
                      </div>
                      <div className="text-sm text-slate-600 truncate">
                        <span className="font-medium">Result:</span> {formatResult(item.type, item.result)}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 sm:text-right whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
