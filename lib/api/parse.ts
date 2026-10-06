import type { Game, GamesPage } from "../game";
import { normalizePersian } from "../normalize";
import { computeQuality } from "../quality";
import { isVendor } from "../vendors";
import { ApiError } from "./errors";
import { isFiniteNumber, isRecord, isStringArray } from "./guards";
import type { RawGame } from "./types";

export function isRawGame(value: unknown): value is RawGame {
  if (!isRecord(value)) return false;
  const { category, description } = value;
  return (
    typeof value._id === "string" &&
    typeof value.title === "string" &&
    (value.companyName === undefined || typeof value.companyName === "string") &&
    typeof value.image === "string" &&
    isRecord(category) &&
    typeof category.title === "string" &&
    (value.vitrinThirdPartyVendors === undefined || isStringArray(value.vitrinThirdPartyVendors)) &&
    typeof value.isLandscape === "boolean" &&
    isFiniteNumber(value.score) &&
    isFiniteNumber(value.rating) &&
    isFiniteNumber(value.like) &&
    isFiniteNumber(value.runCount) &&
    isFiniteNumber(value.seenCount) &&
    isFiniteNumber(value.level) &&
    (description === undefined || typeof description === "string")
  );
}

export function toGame(raw: RawGame): Game {
  const title = raw.title.trim();
  const companyName = raw.companyName?.trim() || "Unknown";

  return {
    id: raw._id,
    title,
    companyName,
    categoryTitle: raw.category.title.trim(),
    description: (raw.description ?? "").trim(),
    imagePath: raw.image,
    vendors: [...new Set((raw.vitrinThirdPartyVendors ?? []).filter(isVendor))],
    orientation: raw.isLandscape ? "landscape" : "portrait",
    score: raw.score,
    rating: raw.rating,
    like: raw.like,
    runCount: raw.runCount,
    seenCount: raw.seenCount,
    level: raw.level,
    quality: computeQuality(raw),
    titleKey: normalizePersian(title),
    companyKey: normalizePersian(companyName),
  };
}

export function parseGamesResponse(json: unknown): GamesPage {
  if (!isRecord(json) || json.state !== true || !isRecord(json.data)) {
    throw new ApiError("Unexpected response envelope");
  }

  const { pageId, eachPerPage, total, games } = json.data;
  if (
    !isFiniteNumber(pageId) ||
    !isFiniteNumber(eachPerPage) ||
    !isFiniteNumber(total) ||
    !Array.isArray(games)
  ) {
    throw new ApiError("Unexpected response page shape");
  }

  const items: readonly unknown[] = games;
  if (!items.every(isRawGame)) {
    throw new ApiError("Unexpected game item shape");
  }

  return {
    pageId,
    eachPerPage,
    total,
    games: items.map(toGame),
  };
}
