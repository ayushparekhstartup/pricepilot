"use client";

import Link from "next/link";
import * as React from "react";

type Recommendation = {
  id: string;
  itemName: string;
  currentPrice: number;
  suggestedPrice: number;
  expectedRevenueChange: number;
};

/** Payload sent to /api/recommendations — mirrors product catalog + sales fields */
type ProductInput = {
  id: string;
  name: string;
  currentPrice: number;
  unitsSoldLast7Days?: number;
  revenueLast7Days?: number;
  avgDailyUnits?: number;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

/** Sample catalog: current prices + sales; Claude returns suggested prices and revenue deltas */
const PRODUCT_CATALOG: ProductInput[] = [
  {
    id: "1",
    name: "Classic Burger",
    currentPrice: 11.99,
    unitsSoldLast7Days: 420,
    revenueLast7Days: 5035.8,
  },
  {
    id: "2",
    name: "Iced Latte (16oz)",
    currentPrice: 5.49,
    unitsSoldLast7Days: 890,
    revenueLast7Days: 4886.1,
  },
  {
    id: "3",
    name: "Weekend Brunch Combo",
    currentPrice: 16.0,
    unitsSoldLast7Days: 210,
    revenueLast7Days: 3360.0,
  },
  {
    id: "4",
    name: "Seasonal Candle (Retail)",
    currentPrice: 24.0,
    unitsSoldLast7Days: 45,
    revenueLast7Days: 1080.0,
  },
  {
    id: "5",
    name: "Organic Granola Bag",
    currentPrice: 9.5,
    unitsSoldLast7Days: 180,
    revenueLast7Days: 1710.0,
  },
];

function estimatedDailyRevenue(products: ProductInput[]): number {
  return products.reduce((sum, p) => sum + (p.revenueLast7Days ?? 0) / 7, 0);
}

function LogoMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
      PP
    </span>
  );
}

function StatCard({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      {subValue ? (
        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{subValue}</div>
      ) : null}
    </div>
  );
}

export default function DashboardPage() {
  const [recommendations, setRecommendations] = React.useState<Recommendation[]>([]);
  const [applied, setApplied] = React.useState<Record<string, boolean>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const loadRecommendations = React.useCallback(async () => {
    setError(null);
    setLoading(true);
    setApplied({});
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: PRODUCT_CATALOG }),
      });
      const data = (await res.json()) as {
        recommendations?: Recommendation[];
        error?: string;
      };
      if (!res.ok) {
        setRecommendations([]);
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      if (!data.recommendations?.length) {
        setRecommendations([]);
        setError("No recommendations returned");
        return;
      }
      setRecommendations(data.recommendations);
    } catch (e) {
      setRecommendations([]);
      setError(e instanceof Error ? e.message : "Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      void loadRecommendations();
    }, 0);
    return () => window.clearTimeout(t);
  }, [loadRecommendations]);

  const appliedCount = React.useMemo(
    () => recommendations.reduce((acc, r) => acc + (applied[r.id] ? 1 : 0), 0),
    [applied, recommendations],
  );

  const expectedLift = React.useMemo(
    () =>
      recommendations.reduce(
        (acc, r) => acc + (applied[r.id] ? r.expectedRevenueChange : 0),
        0,
      ),
    [applied, recommendations],
  );

  const totalRevenueToday = estimatedDailyRevenue(PRODUCT_CATALOG);
  const todaysRecommendations = recommendations.length;
  const appliedChanges = appliedCount;
  const appliedRate = todaysRecommendations === 0 ? 0 : appliedChanges / todaysRecommendations;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">PricePilot</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Dashboard</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <Link
              href="/costs"
              className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black/40 dark:text-zinc-50 dark:hover:bg-white/10"
            >
              Costs
            </Link>
            <button
              type="button"
              onClick={() => void loadRecommendations()}
              disabled={loading}
              className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-white/10 dark:bg-black/40 dark:text-zinc-50 dark:hover:bg-white/10"
            >
              {loading ? "Refreshing…" : "Refresh AI"}
            </button>
            <span className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-sm font-medium text-zinc-600 dark:border-white/10 dark:bg-black/40 dark:text-zinc-300 sm:inline-flex">
              <span className="size-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
              Claude recommendations
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Pricing recommendations</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Suggestions from Claude based on your catalog and recent sales. Apply changes individually to track
              projected impact.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-50">
              Projected lift:{" "}
              <span
                className={
                  expectedLift >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }
              >
                {expectedLift >= 0 ? "" : "−"}
                {currency.format(Math.abs(expectedLift))}
              </span>
              <span className="ml-2 text-zinc-500 dark:text-zinc-400">/ day (applied)</span>
            </div>
          </div>
        </div>

        {error ? (
          <div
            className="mt-6 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-800 dark:text-rose-200"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Est. daily revenue (from 7d data)" value={currency.format(totalRevenueToday)} />
          <StatCard label="Today’s recommendations" value={loading ? "…" : String(todaysRecommendations)} />
          <StatCard
            label="Applied changes"
            value={loading ? "…" : `${appliedChanges} (${percent.format(appliedRate)})`}
            subValue={
              !loading && expectedLift !== 0
                ? `Projected lift: ${expectedLift >= 0 ? "" : "−"}${currency.format(Math.abs(expectedLift))} / day`
                : undefined
            }
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 border-b border-black/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Recommendations table</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Powered by Anthropic Claude (claude-sonnet-4-5).
              </p>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Generating pricing recommendations…
            </div>
          ) : recommendations.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No rows to display. Try Refresh AI or check your API configuration.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-black/40 dark:text-zinc-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Item Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Current Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Suggested Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Expected Revenue Change
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {recommendations.map((r) => {
                    const isApplied = Boolean(applied[r.id]);
                    const delta = r.suggestedPrice - r.currentPrice;
                    const revPositive = r.expectedRevenueChange >= 0;

                    return (
                      <tr key={r.id} className="hover:bg-zinc-50/60 dark:hover:bg-white/5">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-zinc-900 dark:text-zinc-50">{r.itemName}</div>
                          <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                            Suggested change:{" "}
                            <span
                              className={
                                delta >= 0
                                  ? "text-emerald-700 dark:text-emerald-400"
                                  : "text-rose-700 dark:text-rose-400"
                              }
                            >
                              {delta >= 0 ? "+" : ""}
                              {currency.format(delta)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{currency.format(r.currentPrice)}</td>
                        <td className="px-6 py-4 font-medium">{currency.format(r.suggestedPrice)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={
                              revPositive
                                ? "inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300"
                                : "inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 font-semibold text-rose-700 dark:text-rose-300"
                            }
                          >
                            {revPositive ? "+" : "−"}
                            {currency.format(Math.abs(r.expectedRevenueChange))}
                            <span className="opacity-70">/ day</span>
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() =>
                              setApplied((prev) => ({
                                ...prev,
                                [r.id]: !prev[r.id],
                              }))
                            }
                            className={
                              isApplied
                                ? "inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:hover:bg-white/5"
                                : "inline-flex h-10 items-center justify-center rounded-full bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            }
                          >
                            {isApplied ? "Applied" : "Apply"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
