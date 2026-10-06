import type { FilterSelections } from "./filters.config";
import { isSortOption, type SortOption } from "./sort";

export type UrlViewState = {
  readonly query: string;
  readonly sort: SortOption;
  readonly selections: FilterSelections;
  readonly favoritesOnly: boolean;
  readonly state: { readonly mode: "browse"; readonly sort: SortOption } | { readonly mode: "search"; readonly query: string; readonly sort: SortOption | "relevance" };
};

const FILTER_KEYS = ["vendor", "category", "score", "orientation"] as const;

type SearchParamsLike = Pick<URLSearchParams, "get" | "getAll">;

export function parseViewState(params: SearchParamsLike): UrlViewState {
  const query = params.get("q") ?? "";
  const requestedSort = params.get("sort");
  const sort = requestedSort && isSortOption(requestedSort) ? requestedSort : "quality";
  const selections = Object.fromEntries(FILTER_KEYS.map((key) => [key, params.getAll(key)]).filter(([, values]) => values.length > 0)) as FilterSelections;
  const favoritesOnly = params.get("favorites") === "1";
  return {
    query,
    sort,
    selections,
    favoritesOnly,
    state: query.trim() ? { mode: "search", query, sort: params.get("sort") === "relevance" ? "relevance" : sort } : { mode: "browse", sort },
  };
}

export function serializeViewState(state: Pick<UrlViewState, "query" | "sort" | "selections" | "favoritesOnly">): string {
  const params = new URLSearchParams();
  if (state.query.trim()) params.set("q", state.query);
  params.set("sort", state.sort);
  for (const key of FILTER_KEYS) for (const value of state.selections[key] ?? []) params.append(key, value);
  if (state.favoritesOnly) params.set("favorites", "1");
  return params.toString();
}
