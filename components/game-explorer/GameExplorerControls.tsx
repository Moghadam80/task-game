"use client";

import type { FilterId, FilterSelections } from "@/lib/filters.config";
import { FILTER_DEFINITIONS } from "@/lib/filters.config";
import type { SortOption } from "@/lib/sort";
import { ActiveFilters } from "./ActiveFilters";
import { FavoriteToggle } from "./FavoriteToggle";
import { FilterPopover } from "./FilterPopover";
import { SortMenu } from "./SortMenu";

type ControlsProps = {
  readonly options: ReadonlyMap<string, readonly string[]>;
  readonly selections: FilterSelections;
  readonly favoritesOnly: boolean;
  readonly sort: SortOption;
  readonly onSelection: (id: FilterId, values: string[]) => void;
  readonly onFavoritesChange: (value: boolean) => void;
  readonly onSort: (value: SortOption) => void;
  readonly onClear: () => void;
};

export function GameExplorerControls({ options, selections, favoritesOnly, sort, onSelection, onFavoritesChange, onSort, onClear }: ControlsProps) {
  const activeCount = FILTER_DEFINITIONS.reduce((count, definition) => count + (selections[definition.id]?.length ?? 0), 0) + (favoritesOnly ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <span className="hidden text-xs font-semibold uppercase tracking-wide text-zinc-400 sm:inline">فیلترها</span>
        {FILTER_DEFINITIONS.map((definition) => <FilterPopover key={definition.id} definition={definition} options={options.get(definition.id) ?? []} selected={selections[definition.id] ?? []} onApply={(values) => onSelection(definition.id, values)} />)}
        <FavoriteToggle checked={favoritesOnly} onChange={onFavoritesChange} />
        {activeCount > 0 ? <button type="button" onClick={onClear} className="min-h-10 rounded-xl px-3 text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-zinc-400 dark:hover:text-white">پاک کردن همه</button> : null}
      </div>

      {activeCount > 0 ? <ActiveFilters definitions={FILTER_DEFINITIONS} selections={selections} favoritesOnly={favoritesOnly} onSelection={onSelection} onFavoritesChange={onFavoritesChange} /> : null}

      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
        <p className="hidden text-xs text-zinc-500 sm:block">برای تغییر ترتیب نمایش، از گزینه مرتب‌سازی استفاده کنید.</p>
        <SortMenu value={sort} onChange={onSort} />
      </div>
    </div>
  );
}
