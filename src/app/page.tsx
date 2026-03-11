'use client';

import { useState } from 'react';
import PrimeChecker from '@/components/PrimeChecker';
import PrimeGenerator from '@/components/PrimeGenerator';
import NthPrimeFinder from '@/components/NthPrimeFinder';
import PrimeFactorization from '@/components/PrimeFactorization';
import HistoryLog from '@/components/HistoryLog';

type Tab = 'check' | 'generate' | 'nth' | 'factorize';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'check', label: 'Prime Checker', icon: '🔍' },
  { id: 'generate', label: 'Generator', icon: '📋' },
  { id: 'nth', label: 'Nth Prime', icon: '🎯' },
  { id: 'factorize', label: 'Factorization', icon: '🧮' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('check');
  const [historyKey, setHistoryKey] = useState(0);

  const onCalculationDone = () => {
    setHistoryKey((k) => k + 1);
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <span className="text-3xl">∑</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Prime Calculator
          </h1>
          <p className="mt-2 text-slate-500 text-lg">
            Explore the world of prime numbers
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-100 p-2 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Calculator Panels */}
        <div className="card mb-6">
          {activeTab === 'check' && <PrimeChecker onDone={onCalculationDone} />}
          {activeTab === 'generate' && <PrimeGenerator onDone={onCalculationDone} />}
          {activeTab === 'nth' && <NthPrimeFinder onDone={onCalculationDone} />}
          {activeTab === 'factorize' && <PrimeFactorization onDone={onCalculationDone} />}
        </div>

        {/* History */}
        <HistoryLog key={historyKey} />

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>Prime Calculator &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </main>
  );
}
