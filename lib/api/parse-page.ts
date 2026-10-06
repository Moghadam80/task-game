import type { Game, GamesPage } from "../game";
import { isVendor } from "../vendors";
import { ApiError } from "./errors";
import { isFiniteNumber, isRecord, isStringArray } from "./guards";

export function isGame(value: unknown): value is Game {
  if (!isRecord(value)) return false;
  const { vendors, orientation } = value;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.companyName === "string" &&
    typeof value.categoryTitle === "string" &&
    typeof value.description === "string" &&
    typeof value.imagePath === "string" &&
    typeof value.titleKey === "string" &&
    typeof value.companyKey === "string" &&
    isStringArray(vendors) &&
    vendors.every(isVendor) &&
    (orientation === "landscape" || orientation === "portrait") &&
    isFiniteNumber(value.score) &&
    isFiniteNumber(value.rating) &&
    isFiniteNumber(value.like) &&
    isFiniteNumber(value.runCount) &&
    isFiniteNumber(value.seenCount) &&
    isFiniteNumber(value.level) &&
    isFiniteNumber(value.quality)
  );
}

export function parseGamesPage(json: unknown): GamesPage {
  if (!isRecord(json)) throw new ApiError("Proxy returned an unexpected body");
  const { pageId, eachPerPage, total, games } = json;
  if (
    !isFiniteNumber(pageId) ||
    !isFiniteNumber(eachPerPage) ||
    !isFiniteNumber(total) ||
    !Array.isArray(games)
  ) {
    throw new ApiError("Proxy returned an unexpected page shape");
  }

  const items: readonly unknown[] = games;
  if (!items.every(isGame)) throw new ApiError("Proxy returned invalid games");
  return { pageId, eachPerPage, total, games: items };
}
