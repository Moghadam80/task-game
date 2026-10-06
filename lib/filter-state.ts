import { filterGames } from "./filter";
import type { FilterSelections } from "./filters.config";
import type { Game } from "./game";
import { queryTokens } from "./normalize";
import { sortByRelevance, sortGames, type SortOption } from "./sort";

export type FilterState =
  | { readonly mode: "browse"; readonly sort: SortOption }
  | { readonly mode: "search"; readonly query: string; readonly sort: SortOption | "relevance" };

export type ViewState = {
  readonly state: FilterState;
  readonly selections: FilterSelections;
  readonly favoritesOnly: boolean;
  readonly favoriteIds: ReadonlySet<string>;
};

export function selectGames(games: readonly Game[], view: ViewState): Game[] {
  const { state } = view;
  const tokens = state.mode === "search" ? queryTokens(state.query) : [];
  const filtered = filterGames(games, {
    tokens,
    selections: view.selections,
    favoritesOnly: view.favoritesOnly,
    favoriteIds: view.favoriteIds,
  });
  if (state.mode === "search") {
    if (state.sort === "relevance") return sortByRelevance(filtered, tokens);
    return sortGames(filtered, state.sort);
  }
  return sortGames(filtered, state.sort);
}
