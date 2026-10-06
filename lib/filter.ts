import { FILTER_DEFINITIONS, type FilterDefinition, type FilterSelections } from "./filters.config";
import type { Game } from "./game";

export type FilterCriteria = {
  readonly tokens: readonly string[];
  readonly selections: FilterSelections;
  readonly favoritesOnly: boolean;
  readonly favoriteIds: ReadonlySet<string>;
};

function matchesTokens(game: Game, tokens: readonly string[]): boolean {
  return tokens.every((token) => game.titleKey.includes(token) || game.companyKey.includes(token));
}

function matchesFilter(game: Game, definition: FilterDefinition, selected: readonly string[]): boolean {
  if (selected.length === 0) return true;
  if (definition.kind === "multi") {
    return definition.getValues(game).some((value) => selected.includes(value));
  }
  const minimum = Number(selected[0]);
  return Number.isNaN(minimum) || definition.getValue(game) >= minimum;
}

export function filterGames(games: readonly Game[], criteria: FilterCriteria): Game[] {
  return games.filter((game) => {
    if (criteria.favoritesOnly && !criteria.favoriteIds.has(game.id)) return false;
    if (!matchesTokens(game, criteria.tokens)) return false;
    return FILTER_DEFINITIONS.every((definition) =>
      matchesFilter(game, definition, criteria.selections[definition.id] ?? []),
    );
  });
}

export function listFilterOptions(games: readonly Game[], definition: FilterDefinition): string[] {
  if (definition.kind === "min") return definition.steps.map(String);
  const values = new Set<string>();
  for (const game of games) {
    for (const value of definition.getValues(game)) values.add(value);
  }
  return [...values].sort((a, b) => a.localeCompare(b, "fa"));
}
