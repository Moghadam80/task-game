import type { Game, GamesPage } from "./game";

export function mergePages(pages: readonly GamesPage[]): Game[] {
  const seen = new Set<string>();
  const merged: Game[] = [];
  for (const page of pages) {
    for (const game of page.games) {
      if (!seen.has(game.id)) {
        seen.add(game.id);
        merged.push(game);
      }
    }
  }
  return merged;
}
