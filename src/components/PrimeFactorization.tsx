'use client';

import { useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function PrimeFactorization({ onDone }: Props) {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<{ number: number; factors: number[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFactorize = async () => {
    setError('');
    setResult(null);
    const num = parseInt(number, 10);
    if (!number.trim() || isNaN(num) || num < 2) {
      setError('Please enter an integer greater than or equal to 2.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/prime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'factorize', number: num }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'An error occurred');
        return;
      }
      setResult({ number: data.number, factors: data.factors });
      onDone();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFactorize();
  };

  const getFactorExpression = (factors: number[]): string => {
    const counts: Record<number, number> = {};
    for (const f of factors) counts[f] = (counts[f] || 0) + 1;
    return Object.entries(counts)
      .map(([base, exp]) => (exp > 1 ? `${base}^${exp}` : base))
      .join(' × ');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Prime Factorization</h2>
      <p className="text-slate-500 text-sm mb-4">Break down a number into its prime factors (up to 10,000,000).</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="label">Enter a number ≥ 2</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 360"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            min="2"
          />
        </div>
        <div className="sm:self-end">
          <button
            onClick={handleFactorize}
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? 'Factorizing...' : 'Factorize'}
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
          <div className="text-4xl mb-2">🧮</div>
          <div className="text-slate-600 text-sm mb-2">Prime factorization of <strong>{result.number}</strong></div>
          <div className="text-2xl font-bold text-blue-700 mb-3">
            {result.number} = {getFactorExpression(result.factors)}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {result.factors.map((f, i) => (
              <span
                key={i}
                className="inline-block bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
          {result.factors.length === 1 && result.factors[0] === result.number && (
            <div className="mt-2 text-sm text-green-700 font-semibold">✅ {result.number} is a prime number!</div>
          )}
        </div>
      )}
    </div>
  );
}
