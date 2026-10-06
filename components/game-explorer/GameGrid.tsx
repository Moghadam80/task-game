"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { useFavorites } from "@/hooks/useFavorites";
import { useGames } from "@/hooks/useGames";
import { useVirtualGrid } from "@/hooks/useVirtualGrid";
import { useUrlState } from "@/hooks/useUrlState";
import { SEARCH_DEBOUNCE_MS } from "@/lib/config";
import { FILTER_DEFINITIONS, type FilterId } from "@/lib/filters.config";
import { selectGames } from "@/lib/filter-state";
import type { GamesPage, Game } from "@/lib/game";
import { listFilterOptions } from "@/lib/filter";
import { parseViewState, serializeViewState, type UrlViewState } from "@/lib/url-state";
import { GameCard } from "./GameCard";
import { GameListErrorBoundary } from "./GameListErrorBoundary";
import { GameExplorerControls } from "./GameExplorerControls";
import { GRID_CLASS } from "./layout";

type GameGridProps = { readonly initialPage: GamesPage };

function VirtualizedGames({ games, favoriteIds, onToggleFavorite }: { readonly games: readonly Game[]; readonly favoriteIds: ReadonlySet<string>; readonly onToggleFavorite: (id: string) => void }) {
  const listRef = useRef<HTMLUListElement>(null);
  const virtual = useVirtualGrid({ count: games.length, containerRef: listRef, rowHeight: (width, columns) => {
      const cardWidth = Math.max(0, (width - 16 * (columns - 1)) / columns);
      return cardWidth + 112;
    },
    gap: 16,
    overscan: 2 });
  const visibleGames = games.slice(virtual.startIndex, virtual.endIndex);

  return (
    <ul
      ref={listRef}
      className={GRID_CLASS}
      style={virtual.enabled ? { paddingTop: virtual.top, paddingBottom: virtual.bottom } : undefined}
      aria-label="بازی‌ها"
    >
      {visibleGames.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          eager={!virtual.enabled && index < 4}
          isFavorite={favoriteIds.has(game.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </ul>
  );
}

function SearchField({
  initialValue,
  onDebouncedChange,
  pending,
}: {
  readonly initialValue: string;
  readonly onDebouncedChange: (value: string) => void;
  readonly pending: boolean;
}) {
  const [value, setValue] = useState(initialValue);
  const [focused, setFocused] = useState(false);
  const previousInitialValue = useRef(initialValue);
  const debouncedValue = useDebounce(value, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (previousInitialValue.current === initialValue) return;
    previousInitialValue.current = initialValue;
    queueMicrotask(() => setValue(initialValue));
  }, [initialValue]);

  useEffect(() => {
    if (debouncedValue !== initialValue) onDebouncedChange(debouncedValue);
  }, [debouncedValue, initialValue, onDebouncedChange]);

  return (
    <label className={`group relative block flex-1 rounded-2xl border bg-white transition dark:bg-zinc-900 ${focused ? "border-blue-500 ring-4 ring-blue-500/10" : "border-zinc-200 dark:border-zinc-800"}`}>
      <span className="sr-only">جست‌وجوی بازی یا سازنده</span>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="جست‌وجوی نام بازی یا سازنده..."
        className="h-14 w-full bg-transparent px-12 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
      />
      {pending ? <span className="absolute left-12 top-1/2 size-4 -translate-y-1/2 animate-spin rounded-full border-2 border-zinc-200 border-t-blue-600 motion-reduce:animate-none dark:border-zinc-700 dark:border-t-blue-400" aria-label="در حال به‌روزرسانی" /> : null}
    </label>
  );
}

export function GameGrid({ initialPage }: GameGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlState = parseViewState(searchParams);
  const [, setUrlQuery] = useUrlState<string>("q", "");
  const [isPending, startTransition] = useTransition();
  const handleDebouncedSearch = useCallback((value: string) => {
    startTransition(() => setUrlQuery(value));
  }, [setUrlQuery, startTransition]);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const gamesQuery = useGames(initialPage);

  const allGames = useMemo(() => gamesQuery.data?.games ?? [], [gamesQuery.data?.games]);
  const total = gamesQuery.data?.total ?? initialPage.total;
  const filterOptions = useMemo(
    () => new Map(FILTER_DEFINITIONS.map((definition) => [definition.id, listFilterOptions(allGames, definition)])),
    [allGames],
  );

  const updateUrl = useCallback((nextState: UrlViewState) => {
    const query = serializeViewState(nextState);
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }, [pathname, router]);

  const visibleGames = useMemo(
    () => selectGames(allGames, {
      state: urlState.state,
      selections: urlState.selections,
      favoritesOnly: urlState.favoritesOnly,
      favoriteIds,
    }),
    [allGames, favoriteIds, urlState],
  );

  const setSelection = useCallback((id: FilterId, values: string[]) => {
    updateUrl({ ...urlState, selections: { ...urlState.selections, [id]: values } });
  }, [updateUrl, urlState]);

  const clearFilters = useCallback(() => {
    updateUrl({ ...urlState, query: "", selections: {}, favoritesOnly: false });
  }, [updateUrl, urlState]);

  const hasFilters = Boolean(
    urlState.query ||
    urlState.favoritesOnly ||
    Object.values(urlState.selections).some((values) => (values?.length ?? 0) > 0),
  );
  const isEmpty = visibleGames.length === 0;
  const isLoadingInitial = gamesQuery.isPending && allGames.length === 0;

  return (
    <section aria-label="فهرست بازی‌ها">
      <div className="mb-7 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchField
            initialValue={urlState.query}
            onDebouncedChange={handleDebouncedSearch}
            pending={isPending}
          />
          <div className="hidden items-center rounded-2xl border border-zinc-200 bg-white px-4 text-xs text-zinc-500 sm:flex dark:border-zinc-800 dark:bg-zinc-900">{total.toLocaleString("fa-IR")} بازی</div>
        </div>

        <GameExplorerControls
          options={filterOptions}
          selections={urlState.selections}
          favoritesOnly={urlState.favoritesOnly}
          sort={urlState.sort}
          onSelection={setSelection}
          onFavoritesChange={(value) => updateUrl({ ...urlState, favoritesOnly: value })}
          onSort={(value) => updateUrl({ ...urlState, sort: value })}
          onClear={clearFilters}
        />

        <div className="flex items-center justify-between gap-3" aria-live="polite">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
            {visibleGames.length.toLocaleString("fa-IR")} بازی نمایش داده می‌شود
            {isPending ? <span className="mr-2 text-xs font-normal text-zinc-400">در حال به‌روزرسانی...</span> : null}
          </p>
          <span className="text-xs text-zinc-400">{allGames.length.toLocaleString("fa-IR")} مورد بارگذاری شده</span>
        </div>
      </div>

      {isLoadingInitial ? null : isEmpty ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/60 px-6 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm dark:bg-zinc-900">⌕</div>
          <h2 className="mt-5 text-lg font-bold text-zinc-900 dark:text-white">بازی‌ای پیدا نشد</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">معیارهای جست‌وجو یا فیلتر را تغییر دهید تا بازی‌های بیشتری ببینید.</p>
          {hasFilters ? <button type="button" onClick={clearFilters} className="mt-5 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950">نمایش همه بازی‌ها</button> : null}
        </div>
      ) : (
        <GameListErrorBoundary>
          <VirtualizedGames games={visibleGames} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
        </GameListErrorBoundary>
      )}

      {gamesQuery.hasNextPage && !isEmpty ? <div className="mt-9 flex justify-center"><button type="button" disabled={gamesQuery.isFetchingNextPage} onClick={() => gamesQuery.fetchNextPage()} className="group inline-flex min-h-11 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-sm font-bold text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-700 dark:focus-visible:ring-offset-zinc-950">{gamesQuery.isFetchingNextPage ? <span className="size-4 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 motion-reduce:animate-none" /> : <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 4v12M5 11l5 5 5-5" /></svg>}{gamesQuery.isFetchingNextPage ? "در حال بارگذاری..." : "بازی‌های بیشتر"}</button></div> : null}
      {gamesQuery.isError ? <div role="alert" className="mx-auto mt-4 max-w-lg rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">بارگذاری صفحه بعدی ناموفق بود. دوباره تلاش کنید.</div> : null}
    </section>
  );
}
