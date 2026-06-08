"use client";

import Link from "next/link";
import * as React from "react";

type CostLineItem = {
  id: string;
  itemName: string;
  cogs: number;
  sellingPrice: number;
  unitsSoldPerDay: number;
  laborCostPerItem: number;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const MARGIN_THRESHOLD = 30;

function LogoMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
      PP
    </span>
  );
}

function grossMarginPercent(price: number, cogs: number, labor: number): number {
  if (price <= 0 || !Number.isFinite(price)) return 0;
  const unitCost = cogs + labor;
  return ((price - unitCost) / price) * 100;
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function CostsPage() {
  const [items, setItems] = React.useState<CostLineItem[]>([]);
  const [draft, setDraft] = React.useState({
    itemName: "",
    cogs: "",
    sellingPrice: "",
    unitsSoldPerDay: "",
    laborCostPerItem: "",
  });

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const name = draft.itemName.trim();
    const cogs = Number(draft.cogs);
    const sellingPrice = Number(draft.sellingPrice);
    const unitsSoldPerDay = Number(draft.unitsSoldPerDay);
    const laborCostPerItem = Number(draft.laborCostPerItem);
    if (!name) return;
    if (![cogs, sellingPrice, unitsSoldPerDay, laborCostPerItem].every((n) => Number.isFinite(n) && n >= 0)) return;

    setItems((prev) => [
      ...prev,
      {
        id: newId(),
        itemName: name,
        cogs,
        sellingPrice,
        unitsSoldPerDay,
        laborCostPerItem,
      },
    ]);
    setDraft({
      itemName: "",
      cogs: "",
      sellingPrice: "",
      unitsSoldPerDay: "",
      laborCostPerItem: "",
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">PricePilot</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Cost & margin</div>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center rounded-full border border-black/10 bg-white/70 px-4 text-sm font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 dark:border-white/10 dark:bg-black/40 dark:text-zinc-50 dark:hover:bg-white/10"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Product costs</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          Enter each item’s COGS, selling price, daily volume, and labor per unit. Data stays in this browser session
          only.
        </p>

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <h2 className="text-base font-semibold tracking-tight">Add a product</h2>
          <form onSubmit={addItem} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-3">
              <label htmlFor="itemName" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Item name
              </label>
              <input
                id="itemName"
                value={draft.itemName}
                onChange={(e) => setDraft((d) => ({ ...d, itemName: e.target.value }))}
                placeholder="e.g. Classic Burger"
                required
                className="mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400/60 dark:focus:ring-indigo-400/10"
              />
            </div>
            <div>
              <label htmlFor="cogs" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Cost to make / acquire (COGS)
              </label>
              <input
                id="cogs"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={draft.cogs}
                onChange={(e) => setDraft((d) => ({ ...d, cogs: e.target.value }))}
                placeholder="0.00"
                required
                className="mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400/60 dark:focus:ring-indigo-400/10"
              />
            </div>
            <div>
              <label htmlFor="sellingPrice" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Selling price
              </label>
              <input
                id="sellingPrice"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={draft.sellingPrice}
                onChange={(e) => setDraft((d) => ({ ...d, sellingPrice: e.target.value }))}
                placeholder="0.00"
                required
                className="mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400/60 dark:focus:ring-indigo-400/10"
              />
            </div>
            <div>
              <label htmlFor="unitsSoldPerDay" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Units sold per day
              </label>
              <input
                id="unitsSoldPerDay"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.1"
                value={draft.unitsSoldPerDay}
                onChange={(e) => setDraft((d) => ({ ...d, unitsSoldPerDay: e.target.value }))}
                placeholder="0"
                required
                className="mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400/60 dark:focus:ring-indigo-400/10"
              />
            </div>
            <div>
              <label htmlFor="laborCostPerItem" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Labor cost per item
              </label>
              <input
                id="laborCostPerItem"
                type="number"
                inputMode="decimal"
                min={0}
                step="0.01"
                value={draft.laborCostPerItem}
                onChange={(e) => setDraft((d) => ({ ...d, laborCostPerItem: e.target.value }))}
                placeholder="0.00"
                required
                className="mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400/60 dark:focus:ring-indigo-400/10"
              />
            </div>
            <div className="flex items-end sm:col-span-2 lg:col-span-3">
              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
              >
                Add product
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="border-b border-black/5 px-6 py-4 dark:border-white/10">
            <h2 className="text-base font-semibold tracking-tight">Margin summary</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Gross margin % = (selling price − COGS − labor) ÷ selling price. Rows under {MARGIN_THRESHOLD}% are
              highlighted.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="px-6 py-14 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Add at least one product to see the summary.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-black/40 dark:text-zinc-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Item name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Gross margin %
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Daily revenue
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Daily profit
                    </th>
                    <th scope="col" className="px-6 py-3 w-24">
                      {/* remove */}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {items.map((row) => {
                    const margin = grossMarginPercent(row.sellingPrice, row.cogs, row.laborCostPerItem);
                    const lowMargin = margin < MARGIN_THRESHOLD;
                    const dailyRevenue = row.sellingPrice * row.unitsSoldPerDay;
                    const unitProfit = row.sellingPrice - row.cogs - row.laborCostPerItem;
                    const dailyProfit = unitProfit * row.unitsSoldPerDay;

                    return (
                      <tr
                        key={row.id}
                        className={
                          lowMargin
                            ? "bg-rose-500/10 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100"
                            : "hover:bg-zinc-50/60 dark:hover:bg-white/5"
                        }
                      >
                        <td className="px-6 py-4 font-semibold">{row.itemName}</td>
                        <td className="px-6 py-4 font-medium tabular-nums">
                          {margin.toFixed(1)}%
                          {lowMargin ? (
                            <span className="ml-2 text-xs font-normal text-rose-700 dark:text-rose-300">Low margin</span>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 tabular-nums">{currency.format(dailyRevenue)}</td>
                        <td
                          className={
                            "px-6 py-4 tabular-nums font-medium " +
                            (dailyProfit >= 0
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-rose-800 dark:text-rose-300")
                          }
                        >
                          {currency.format(dailyProfit)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            onClick={() => removeItem(row.id)}
                            className="text-xs font-semibold text-zinc-500 underline-offset-2 hover:text-zinc-800 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
                          >
                            Remove
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
