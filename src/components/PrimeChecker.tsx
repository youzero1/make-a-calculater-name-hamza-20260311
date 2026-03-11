'use client';

import { useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function PrimeChecker({ onDone }: Props) {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<{ number: number; isPrime: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setError('');
    setResult(null);
    const num = parseInt(number, 10);
    if (!number.trim() || isNaN(num) || num < 0) {
      setError('Please enter a valid non-negative integer.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/prime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'check', number: num }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'An error occurred');
        return;
      }
      setResult({ number: data.number, isPrime: data.isPrime });
      onDone();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheck();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">Prime Number Checker</h2>
      <p className="text-slate-500 text-sm mb-4">Determine if a number is prime or composite.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="label">Enter a number</label>
          <input
            type="number"
            className="input-field"
            placeholder="e.g. 97"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            min="0"
          />
        </div>
        <div className="sm:self-end">
          <button
            onClick={handleCheck}
            disabled={loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? 'Checking...' : 'Check'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm">
          {error}
        </div>
      )}

      {result !== null && (
        <div className={`result-box ${result.isPrime ? 'result-prime' : 'result-not-prime'}`}>
          <div className="text-4xl mb-2">{result.isPrime ? '✅' : '❌'}</div>
          <div className="text-2xl font-bold mb-1">{result.number}</div>
          <div className="text-lg font-semibold">
            {result.isPrime ? 'is a Prime Number' : 'is NOT a Prime Number'}
          </div>
          {!result.isPrime && result.number >= 2 && (
            <div className="text-sm mt-1 opacity-75">It is a composite number.</div>
          )}
          {result.number < 2 && (
            <div className="text-sm mt-1 opacity-75">Numbers less than 2 are neither prime nor composite.</div>
          )}
        </div>
      )}
    </div>
  );
}
