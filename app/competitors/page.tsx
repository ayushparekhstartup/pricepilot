"use client";

import Link from "next/link";
import * as React from "react";

type BusinessType = "restaurant" | "retail" | "service";

type UserItem = {
  id: string;
  name: string;
  price: string;
};

type CompetitorItem = {
  itemName: string;
  competitorPrice: number;
  userPrice: number | null;
  priceDifference: number | null;
  comparison: "lower" | "higher" | "similar" | "unknown";
};

type Competitor = {
  name: string;
  items: CompetitorItem[];
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function LogoMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
      PP
    </span>
  );
}

function newId() {
  return globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function comparisonLabel(item: CompetitorItem): { text: string; className: string } {
  if (item.comparison === "unknown" || item.priceDifference === null) {
    return { text: "No user price", className: "text-zinc-500 dark:text-zinc-400" };
  }
  const diff = item.priceDifference;
  const abs = currency.format(Math.abs(diff));
  if (item.comparison === "similar") {
    return { text: "Similar to you", className: "text-zinc-600 dark:text-zinc-300" };
  }
  if (diff < 0) {
    return {
      text: `${abs} below you`,
      className: "text-rose-700 dark:text-rose-300",
    };
  }
  return {
    text: `${abs} above you`,
    className: "text-emerald-700 dark:text-emerald-400",
  };
}

export default function CompetitorsPage() {
  const [businessName, setBusinessName] = React.useState("");
  const [businessType, setBusinessType] = React.useState<BusinessType>("restaurant");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [userItems, setUserItems] = React.useState<UserItem[]>([
    { id: newId(), name: "", price: "" },
    { id: newId(), name: "", price: "" },
  ]);
  const [competitors, setCompetitors] = React.useState<Competitor[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searched, setSearched] = React.useState(false);

  const addUserItem = () => {
    setUserItems((prev) => [...prev, { id: newId(), name: "", price: "" }]);
  };

  const removeUserItem = (id: string) => {
    setUserItems((prev) => (prev.length <= 1 ? prev : prev.filter((x) => x.id !== id)));
  };

  const updateUserItem = (id: string, field: "name" | "price", value: string) => {
    setUserItems((prev) => prev.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSearched(true);
    setCompetitors([]);

    const items = userItems
      .map((row) => ({
        name: row.name.trim(),
        price: Number(row.price),
      }))
      .filter((row) => row.name && Number.isFinite(row.price) && row.price >= 0);

    try {
      const res = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          businessType,
          city: city.trim(),
          state: state.trim(),
          userItems: items,
        }),
      });
      const data = (await res.json()) as { competitors?: Competitor[]; error?: string };
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
        return;
      }
      if (!data.competitors?.length) {
        setError("No competitors returned");
        return;
      }
      setCompetitors(data.competitors);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load competitors");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-black dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400/60 dark:focus:ring-indigo-400/10";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">PricePilot</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Competitor intel</div>
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
        <h1 className="text-3xl font-semibold tracking-tight">Local competitor pricing</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          Claude searches the web for nearby businesses like yours and compares their public pricing to your menu.
        </p>

        <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <h2 className="text-base font-semibold tracking-tight">Your business</h2>
          <form onSubmit={(e) => void handleSearch(e)} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="businessName" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Business name
                </label>
                <input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Harbor Grill"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="businessType" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Business type
                </label>
                <select
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                  className={inputClass}
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="retail">Retail</option>
                  <option value="service">Service</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    City
                  </label>
                  <input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Austin"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    State
                  </label>
                  <input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="TX"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-black/5 pt-4 dark:border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">Your items (for price comparison)</h3>
                <button
                  type="button"
                  onClick={addUserItem}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  + Add item
                </button>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Optional but recommended — enter items you sell and your current prices.
              </p>
              <div className="mt-3 space-y-2">
                {userItems.map((row) => (
                  <div key={row.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      value={row.name}
                      onChange={(e) => updateUserItem(row.id, "name", e.target.value)}
                      placeholder="Item name"
                      className={inputClass + " sm:mt-0 sm:flex-1"}
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={row.price}
                      onChange={(e) => updateUserItem(row.id, "price", e.target.value)}
                      placeholder="Your price"
                      className={inputClass + " sm:mt-0 sm:w-36"}
                    />
                    <button
                      type="button"
                      onClick={() => removeUserItem(row.id)}
                      className="shrink-0 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:w-auto"
            >
              {loading ? "Searching competitors…" : "Find competitors"}
            </button>
          </form>
        </section>

        {error ? (
          <div
            className="mt-6 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-800 dark:text-rose-200"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white px-6 py-16 text-center text-sm text-zinc-500 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
            Searching local competitors and pricing with Claude web search…
          </div>
        ) : null}

        {!loading && searched && competitors.length > 0 ? (
          <section className="mt-8 space-y-6">
            {competitors.map((competitor) => (
              <div
                key={competitor.name}
                className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950"
              >
                <div className="border-b border-black/5 px-6 py-4 dark:border-white/10">
                  <h2 className="text-base font-semibold tracking-tight">{competitor.name}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-black/40 dark:text-zinc-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Item
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Their price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Your price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Comparison
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/10">
                      {competitor.items.map((item) => {
                        const cmp = comparisonLabel(item);
                        return (
                          <tr key={`${competitor.name}-${item.itemName}`} className="hover:bg-zinc-50/60 dark:hover:bg-white/5">
                            <td className="px-6 py-4 font-medium">{item.itemName}</td>
                            <td className="px-6 py-4 tabular-nums">{currency.format(item.competitorPrice)}</td>
                            <td className="px-6 py-4 tabular-nums">
                              {item.userPrice !== null ? currency.format(item.userPrice) : "—"}
                            </td>
                            <td className={"px-6 py-4 text-sm font-medium " + cmp.className}>{cmp.text}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {!loading && searched && !error && competitors.length === 0 ? (
          <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No results yet. Submit the form to search.
          </div>
        ) : null}
      </main>
    </div>
  );
}
