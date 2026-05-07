import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh)] bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold tracking-tight"
            aria-label="PricePilot home"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
              PP
            </span>
            <span className="text-base">PricePilot</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-zinc-600 dark:text-zinc-300 md:flex">
            <a className="hover:text-zinc-900 dark:hover:text-white" href="#features">
              Features
            </a>
            <Link className="hover:text-zinc-900 dark:hover:text-white" href="/signup">
              Get Started
            </Link>
          </nav>

          <Link
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(99,102,241,0.25),rgba(0,0,0,0))] dark:bg-[radial-gradient(60%_40%_at_50%_0%,rgba(99,102,241,0.25),rgba(0,0,0,0))]"
            aria-hidden="true"
          />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div className="flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 backdrop-blur dark:border-white/10 dark:bg-black/40 dark:text-zinc-200">
                <span className="size-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                Dynamic pricing for restaurants and retail
              </div>

              <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Turn pricing into a profit lever with <span className="text-indigo-600 dark:text-indigo-400">PricePilot</span>.
              </h1>

              <p className="max-w-xl text-pretty text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                PricePilot helps small and mid-sized businesses automatically adjust prices based on demand, inventory, and
                timing—so you can increase margin without guessing.
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/70 px-6 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-black/40 dark:text-white dark:hover:bg-black/60"
                >
                  See benefits
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  No long-term contracts
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Fast setup
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  Built for SMB teams
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-black/10 bg-gradient-to-b from-white to-zinc-50 p-6 shadow-sm dark:border-white/10 dark:from-zinc-950 dark:to-black">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">Revenue Impact</div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    +12% margin
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold">Lunch specials</div>
                        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          Increase price slightly during peak demand.
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Suggested</div>
                        <div className="text-lg font-semibold">$12.49</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold">Slow-moving inventory</div>
                        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          Discount items before they expire or sit.
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Suggested</div>
                        <div className="text-lg font-semibold">$8.99</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold">High-demand items</div>
                        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          Protect profit when supply is tight.
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Suggested</div>
                        <div className="text-lg font-semibold">$19.00</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-indigo-600/10 p-4 dark:bg-indigo-500/10">
                  <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">What you get</div>
                  <ul className="mt-2 space-y-2 text-sm text-indigo-900/80 dark:text-indigo-100/80">
                    <li className="flex gap-2">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-indigo-700 dark:text-indigo-300" />
                      Rules you control, recommendations you can trust.
                    </li>
                    <li className="flex gap-2">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-indigo-700 dark:text-indigo-300" />
                      Simple reporting that shows impact over time.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-black/5 py-16 dark:border-white/10 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight">Three benefits that move the needle</h2>
              <p className="mt-3 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                Built for operators who want better margins without turning their day into a pricing spreadsheet.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <FeatureCard
                title="Capture peak demand"
                description="Raise prices in high-demand windows while staying competitive and consistent with your brand."
                icon={<ChartIcon className="size-5 text-indigo-600 dark:text-indigo-400" />}
              />
              <FeatureCard
                title="Reduce waste and dead stock"
                description="Automatically discount slow movers or expiring items to convert inventory into cash."
                icon={<SparkIcon className="size-5 text-indigo-600 dark:text-indigo-400" />}
              />
              <FeatureCard
                title="Increase profit with confidence"
                description="Clear recommendations plus guardrails so you always know why a price changes."
                icon={<ShieldIcon className="size-5 text-indigo-600 dark:text-indigo-400" />}
              />
            </div>
          </div>
        </section>

        <section id="get-started" className="border-t border-black/5 py-16 dark:border-white/10 md:py-20">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-gradient-to-br from-indigo-600 to-fuchsia-600 p-8 text-white shadow-sm dark:border-white/10 md:p-12">
              <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(60%_50%_at_10%_10%,rgba(255,255,255,0.7),rgba(255,255,255,0))]" />
              <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-semibold tracking-tight">Ready to pilot smarter pricing?</h2>
                  <p className="mt-3 text-lg leading-8 text-white/85">
                    Start with a quick setup and see recommended price moves tailored to your business.
                  </p>
                </div>
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get Started
                </Link>
              </div>
            </div>

            <footer className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-8 text-sm text-zinc-500 dark:border-white/10 dark:text-zinc-400 md:flex-row md:items-center">
              <div className="font-medium text-zinc-700 dark:text-zinc-200">PricePilot</div>
              <div>© {new Date().getFullYear()} PricePilot. All rights reserved.</div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-zinc-950">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/10">
          {icon}
        </div>
        <div className="text-base font-semibold">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M16.25 5.75 8.5 13.5l-3.75-3.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.5 16.5h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M5.5 14V9.5m4 4.5V6.5m4 7.5V8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 2.5l1.2 4a2 2 0 0 0 1.3 1.3l4 1.2-4 1.2a2 2 0 0 0-1.3 1.3l-1.2 4-1.2-4a2 2 0 0 0-1.3-1.3l-4-1.2 4-1.2a2 2 0 0 0 1.3-1.3l1.2-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M10 2.5 16 5v5.2c0 4-2.6 6.5-6 7.3-3.4-.8-6-3.3-6-7.3V5l6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7.2 10.2 9.2 12.2 12.9 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
