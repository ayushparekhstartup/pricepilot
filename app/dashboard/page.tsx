"use client";

import * as React from "react";

type Recommendation = {
  id: string;
  itemName: string;
  currentPrice: number;
  suggestedPrice: number;
  expectedRevenueChange: number; // in dollars, per day estimate
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

const seedData: Recommendation[] = [
  {
    id: "1",
    itemName: "Classic Burger",
    currentPrice: 11.99,
    suggestedPrice: 12.49,
    expectedRevenueChange: 84,
  },
  {
    id: "2",
    itemName: "Iced Latte (16oz)",
    currentPrice: 5.49,
    suggestedPrice: 5.79,
    expectedRevenueChange: 46,
  },
  {
    id: "3",
    itemName: "Weekend Brunch Combo",
    currentPrice: 16.0,
    suggestedPrice: 17.0,
    expectedRevenueChange: 120,
  },
  {
    id: "4",
    itemName: "Seasonal Candle (Retail)",
    currentPrice: 24.0,
    suggestedPrice: 22.5,
    expectedRevenueChange: 35,
  },
  {
    id: "5",
    itemName: "Organic Granola Bag",
    currentPrice: 9.5,
    suggestedPrice: 9.99,
    expectedRevenueChange: 22,
  },
];

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
  const [applied, setApplied] = React.useState<Record<string, boolean>>({});

  const recommendations = React.useMemo(() => seedData, []);

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

  // Fake totals, just for a realistic dashboard feel.
  const totalRevenueToday = 8420;
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

          <div className="hidden items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 sm:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 font-medium dark:border-white/10 dark:bg-black/40">
              <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Live recommendations (demo)
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Pricing recommendations</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Review suggested price moves for today. Apply changes individually to track projected impact.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-50">
              Projected lift:{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {currency.format(expectedLift)}
              </span>
              <span className="ml-2 text-zinc-500 dark:text-zinc-400">/ day</span>
            </div>
          </div>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard label="Total revenue (today)" value={currency.format(totalRevenueToday)} />
          <StatCard label="Today’s recommendations" value={String(todaysRecommendations)} />
          <StatCard
            label="Applied changes"
            value={`${appliedChanges} (${percent.format(appliedRate)})`}
            subValue={expectedLift > 0 ? `Projected lift: ${currency.format(expectedLift)} / day` : undefined}
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="flex items-center justify-between gap-4 border-b border-black/5 px-6 py-4 dark:border-white/10">
            <div>
              <h2 className="text-base font-semibold tracking-tight">Recommendations table</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                Fake data for now—wired for real inputs later.
              </p>
            </div>
          </div>

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

                  return (
                    <tr key={r.id} className="hover:bg-zinc-50/60 dark:hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-50">{r.itemName}</div>
                        <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                          Suggested change:{" "}
                          <span className={delta >= 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}>
                            {delta >= 0 ? "+" : ""}
                            {currency.format(delta)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium">{currency.format(r.currentPrice)}</td>
                      <td className="px-6 py-4 font-medium">{currency.format(r.suggestedPrice)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-700 dark:text-emerald-300">
                          +{currency.format(r.expectedRevenueChange)}
                          <span className="text-emerald-700/70 dark:text-emerald-300/70">/ day</span>
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
        </section>
      </main>
    </div>
  );
}

