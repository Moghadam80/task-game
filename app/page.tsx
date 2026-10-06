import { Suspense } from "react";
import { GamesSection } from "@/components/game-explorer/GamesSection";
import { GridSkeleton } from "@/components/game-explorer/GridSkeleton";
import { ThemeToggle } from "@/components/ThemeToggle";

export const revalidate = 600;

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <header className="mb-8 overflow-hidden rounded-3xl border px-5 py-6 hero-surface shadow-sm sm:px-8 sm:py-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 flex justify-start">
          <ThemeToggle />
        </div>
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">LIFELANDS · GAME EXPLORER</span>
          <h1 className="mt-4 text-3xl font-black tracking-tight hero-title sm:text-4xl dark:text-white">بازی بعدی خودت را پیدا کن</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 hero-copy sm:text-base dark:text-zinc-400">بین بازی‌ها جست‌وجو کن، با فیلترها دقیق‌تر انتخاب کن و بازی‌های موردعلاقه‌ات را برای بعد نگه دار.</p>
        </div>
      </header>
      <Suspense fallback={<GridSkeleton />}>
        <GamesSection />
      </Suspense>
    </main>
  );
}
