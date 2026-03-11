'use client';

import { useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function PrimeGenerator({ onDone }: Props) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState<{ primes: number[]; count: number; start: number; end: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setError('');
    setResult(null);
    const s = parseInt(start, 10);
    const e = parseInt(end, 10);
    if (!start.trim() || !end.trim() || isNaN(s) || isNaN(e)) {
      setError('Please enter valid non-negative integers for both fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/prime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'generate', start: s, end: e }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'An error occurred');
        return;
      }
      setResult({ primes: data.primes, count: data.count, start: data.start, end: data.end });
      onDone();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Prime Number Generator</h2>
      <p className="text-slate-500 text-sm mb-4">Generate all prime numbers within a given range (max range: 100,000).</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="label">Start</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 1"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            min="0"
          />
        </div>
        <div className="flex-1">
          <label className="label">End</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 100"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            min="0"
          />
        </div>
        <div className="sm:self-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? 'Generating...' : 'Generate'}
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
          <div className="text-sm font-medium mb-2">
            Found <span className="font-bold text-lg">{result.count}</span> prime{result.count !== 1 ? 's' : ''} between {result.start} and {result.end}
          </div>
          {result.primes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-h-48 overflow-y-auto">
              {result.primes.map((p) => (
                <span
                  key={p}
                  className="inline-block bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  {p}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-sm mt-2">No primes found in this range.</div>
          )}
        </div>
      )}
    </div>
  );
}
