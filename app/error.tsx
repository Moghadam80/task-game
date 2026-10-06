"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div role="alert" className="rounded-xl border border-red-300 p-6 text-center">
        <p className="font-semibold">دریافت بازی‌ها با مشکل روبه‌رو شد.</p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-zinc-100 dark:text-zinc-900"
        >
          تلاش دوباره
        </button>
      </div>
    </main>
  );
}
