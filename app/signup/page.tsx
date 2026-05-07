"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

function LogoMark() {
  return (
    <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
      PP
    </span>
  );
}

function Field({
  id,
  label,
  type,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400/60 dark:focus:ring-indigo-400/10"
      />
    </div>
  );
}

export default function SignupPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(99,102,241,0.25),rgba(0,0,0,0))]"
        aria-hidden="true"
      />

      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3">
            <LogoMark />
            <div className="text-left leading-tight">
              <div className="text-base font-semibold tracking-tight">PricePilot</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-300">Create your account</div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitting(true);
                window.setTimeout(() => router.push("/dashboard"), 350);
              }}
              className="space-y-5"
            >
              <Field
                id="email"
                label="Email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
              />
              <Field
                id="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
              />

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-11 w-full items-center justify-center rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {submitting ? "Creating account..." : "Sign up"}
              </button>

              <p className="text-center text-sm text-zinc-600 dark:text-zinc-300">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Demo UI only — no backend authentication yet.
          </div>
        </div>
      </main>
    </div>
  );
}

