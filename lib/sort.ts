import type { Game } from "./game";

type NumericKeys<T> = {
  [K in keyof T]-?: T[K] extends number ? K : never;
}[keyof T];

export type SortKey = NumericKeys<Game>;

export const SORT_OPTIONS = ["quality", "score", "runCount", "seenCount", "like"] as const satisfies readonly SortKey[];

export type SortOption = (typeof SORT_OPTIONS)[number];

export const DEFAULT_SORT: SortOption = "quality";

export function isSortOption(value: string): value is SortOption {
  return SORT_OPTIONS.some((option) => option === value);
}

export function sortGames<K extends SortKey>(games: readonly Game[], key: K): Game[] {
  return [...games].sort((a, b) => b[key] - a[key]);
}

function relevanceScore(game: Game, tokens: readonly string[]): number {
  return tokens.reduce((total, token) => {
    if (game.titleKey.startsWith(token)) return total + 3;
    if (game.titleKey.includes(token)) return total + 2;
    return total + 1;
  }, 0);
}

export function sortByRelevance(games: readonly Game[], tokens: readonly string[]): Game[] {
  return [...games].sort(
    (a, b) =>
      relevanceScore(b, tokens) - relevanceScore(a, tokens) ||
      b.quality - a.quality ||
      a.id.localeCompare(b.id),
  );
}
