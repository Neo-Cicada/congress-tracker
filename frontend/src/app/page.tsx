'use client';

import { useEffect, useMemo, useState } from 'react';

type Trade = {
  _id: string;
  politicianName: string;
  chamber: 'House' | 'Senate';
  party?: string;
  ticker: string;
  assetName?: string;
  transactionType: 'Buy' | 'Sell' | 'Unknown';
  amountRange?: string;
  transactionDate?: string;
  filedDate?: string;
  sourceUrl?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function formatDate(s?: string) {
  if (!s) return '—';
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

function partyBadge(party?: string) {
  if (!party) return { label: '—' };
  const p = party.toLowerCase();
  if (p.startsWith('d')) return { label: 'D' };
  if (p.startsWith('r')) return { label: 'R' };
  if (p.includes('ind')) return { label: 'I' };
  return { label: party };
}

export default function HomePage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // filters
  const [ticker, setTicker] = useState('');
  const [politician, setPolitician] = useState('');
  const [type, setType] = useState<'All' | 'Buy' | 'Sell' | 'Unknown'>('All');
  const [chamber, setChamber] = useState<'All' | 'House' | 'Senate'>('All');

  const [limit, setLimit] = useState(50);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('limit', String(limit));

    if (ticker.trim()) params.set('ticker', ticker.trim().toUpperCase());
    if (politician.trim()) params.set('politician', politician.trim());
    if (type !== 'All') params.set('type', type);
    if (chamber !== 'All') params.set('chamber', chamber);

    return params.toString();
  }, [ticker, politician, type, chamber, limit]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/api/trades?${queryString}`, {
          cache: 'no-store'
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();

        if (!cancelled) setTrades(data.trades ?? []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load trades');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (!API_BASE) {
      setError('Missing NEXT_PUBLIC_API_BASE_URL in .env.local');
      setLoading(false);
      return;
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [queryString]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Congress Trades Tracker
          </h1>
          <p className="mt-2 text-zinc-400">
            Track publicly disclosed stock trades by members of the U.S. Congress.
          </p>
        </header>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Ticker</label>
              <input
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
                placeholder="e.g. NVDA"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Politician</label>
              <input
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
                placeholder="e.g. Pelosi"
                value={politician}
                onChange={(e) => setPolitician(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Type</label>
              <select
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="All">All</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-300">Chamber</label>
              <select
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 outline-none focus:border-zinc-600"
                value={chamber}
                onChange={(e) => setChamber(e.target.value as any)}
              >
                <option value="All">All</option>
                <option value="House">House</option>
                <option value="Senate">Senate</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-zinc-400">
              Showing <span className="text-zinc-200">{Math.min(trades.length, limit)}</span> trades
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-zinc-300">Limit</label>
              <select
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-zinc-600"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value, 10))}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
              <button
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm hover:bg-zinc-900"
                onClick={() => {
                  setTicker('');
                  setPolitician('');
                  setType('All');
                  setChamber('All');
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <h2 className="text-base font-medium">Latest Disclosed Trades</h2>
            <span className="text-xs text-zinc-400">
              Source: public disclosure filings
            </span>
          </div>

          {loading ? (
            <div className="p-6 text-zinc-400">Loading…</div>
          ) : error ? (
            <div className="p-6 text-red-300">
              {error}
              <div className="mt-2 text-sm text-zinc-400">
                Tip: confirm backend is running and CORS allows your frontend.
              </div>
            </div>
          ) : trades.length === 0 ? (
            <div className="p-6 text-zinc-400">No trades found for your filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-zinc-950/40 text-zinc-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Member</th>
                    <th className="px-4 py-3 text-left font-medium">Ch.</th>
                    <th className="px-4 py-3 text-left font-medium">Party</th>
                    <th className="px-4 py-3 text-left font-medium">Ticker</th>
                    <th className="px-4 py-3 text-left font-medium">Type</th>
                    <th className="px-4 py-3 text-left font-medium">Amount</th>
                    <th className="px-4 py-3 text-left font-medium">Trade Date</th>
                    <th className="px-4 py-3 text-left font-medium">Filed</th>
                    <th className="px-4 py-3 text-left font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => {
                    const badge = partyBadge(t.party);
                    return (
                      <tr
                        key={t._id}
                        className="border-t border-zinc-800 hover:bg-zinc-950/30"
                      >
                        <td className="px-4 py-3">{t.politicianName}</td>
                        <td className="px-4 py-3 text-zinc-300">{t.chamber}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs text-zinc-200">
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium">{t.ticker}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-2 py-1 text-xs">
                            {t.transactionType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{t.amountRange ?? '—'}</td>
                        <td className="px-4 py-3 text-zinc-300">{formatDate(t.transactionDate)}</td>
                        <td className="px-4 py-3 text-zinc-300">{formatDate(t.filedDate)}</td>
                        <td className="px-4 py-3">
                          {t.sourceUrl ? (
                            <a
                              className="text-zinc-200 underline decoration-zinc-700 underline-offset-4 hover:text-white"
                              href={t.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="mt-6 text-xs text-zinc-500">
          Disclaimer: informational only, not investment advice.
        </footer>
      </div>
    </main>
  );
}
