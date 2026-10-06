"use client";

import { FILTER_DEFINITIONS, type FilterId, type FilterSelections } from "@/lib/filters.config";
import { displayFilterValue } from "./FilterPopover";

type ActiveFiltersProps = {
  readonly definitions: typeof FILTER_DEFINITIONS;
  readonly selections: FilterSelections;
  readonly favoritesOnly: boolean;
  readonly onSelection: (id: FilterId, values: string[]) => void;
  readonly onFavoritesChange: (value: boolean) => void;
};

export function ActiveFilters({ definitions, selections, favoritesOnly, onSelection, onFavoritesChange }: ActiveFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="فیلترهای فعال">
      <span className="text-xs text-zinc-400">فعال:</span>
      {definitions.flatMap((definition) => (selections[definition.id] ?? []).map((value) => (
        <span key={definition.id + "-" + value} className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
          {displayFilterValue(definition, value)}
          <button type="button" aria-label={"حذف فیلتر " + displayFilterValue(definition, value)} onClick={() => onSelection(definition.id, (selections[definition.id] ?? []).filter((item) => item !== value))} className="rounded-full p-0.5 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-blue-900"><span aria-hidden="true">×</span></button>
        </span>
      )))}
      {favoritesOnly ? <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">علاقه‌مندی‌ها<button type="button" aria-label="حذف فیلتر علاقه‌مندی‌ها" onClick={() => onFavoritesChange(false)} className="rounded-full p-0.5 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"><span aria-hidden="true">×</span></button></span> : null}
    </div>
  );
}
