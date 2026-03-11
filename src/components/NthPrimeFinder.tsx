'use client';

import { useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function NthPrimeFinder({ onDone }: Props) {
  const [n, setN] = useState('');
  const [result, setResult] = useState<{ n: number; prime: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFind = async () => {
    setError('');
    setResult(null);
    const nNum = parseInt(n, 10);
    if (!n.trim() || isNaN(nNum) || nNum < 1) {
      setError('Please enter a valid positive integer.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/prime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'nth', n: nNum }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'An error occurred');
        return;
      }
      setResult({ n: data.n, prime: data.prime });
      onDone();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFind();
  };

  const getOrdinal = (n: number): string => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Nth Prime Finder</h2>
      <p className="text-slate-500 text-sm mb-4">Find the Nth prime number (up to N = 10,000).</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="label">Enter N</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 100"
            value={n}
            onChange={(e) => setN(e.target.value)}
            onKeyDown={handleKeyDown}
            min="1"
          />
        </div>
        <div className="sm:self-end">
          <button
            onClick={handleFind}
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? 'Finding...' : 'Find'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm">
          {error}
        </div>
      )}

      {result !== null && (
        <div className="result-box result-info">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-slate-600 text-sm mb-1">The {getOrdinal(result.n)} prime number is</div>
          <div className="text-4xl font-extrabold text-blue-700">{result.prime}</div>
        </div>
      )}
    </div>
  );
}
