import type { Game } from "../lib/game";
import { normalizePersian } from "../lib/normalize";

export function makeGame(overrides: Partial<Game> = {}): Game {
  const title = overrides.title ?? "Sample Game";
  const companyName = overrides.companyName ?? "Studio";
  return {
    id: "id-1",
    title,
    companyName,
    categoryTitle: "اکشن",
    description: "",
    imagePath: "game/file-1.webp",
    vendors: ["soroush", "rubika"],
    orientation: "landscape",
    score: 4,
    rating: 0.5,
    like: 5,
    runCount: 100,
    seenCount: 200,
    level: 10,
    quality: 0.5,
    titleKey: normalizePersian(title),
    companyKey: normalizePersian(companyName),
    ...overrides,
  };
}
