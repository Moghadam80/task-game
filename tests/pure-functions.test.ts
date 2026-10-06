import { isFiniteNumber, isRecord, isStringArray } from "../lib/api/guards";
import { resolveImageUrl } from "../lib/image";
import { mergePages } from "../lib/merge";
import { parsePageParam } from "../lib/page-param";
import { sortByRelevance, sortGames } from "../lib/sort";
import { parseViewState, serializeViewState } from "../lib/url-state";
import { makeGame } from "./fixtures";

describe("guards", () => {
  it("narrows records and finite numbers", () => {
    expect(isRecord({ value: 1 })).toBe(true);
    expect(isRecord(null)).toBe(false);
    expect(isFiniteNumber(1.5)).toBe(true);
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isStringArray(["a", "b"])).toBe(true);
    expect(isStringArray(["a", 2])).toBe(false);
  });
});

describe("parsePageParam", () => {
  it("accepts valid bounded page numbers", () => {
    expect(parsePageParam(null)).toBe(1);
    expect(parsePageParam("12")).toBe(12);
  });

  it("rejects invalid and out-of-range pages", () => {
    expect(parsePageParam("0")).toBeNull();
    expect(parsePageParam("1.5")).toBeNull();
    expect(parsePageParam("10001")).toBeNull();
  });
});

describe("sort functions", () => {
  const games = [
    makeGame({ id: "a", score: 3 }),
    makeGame({ id: "b", score: 4.8 }),
    makeGame({ id: "c", score: 4.1 }),
  ];

  it("sorts by numeric fields without mutating the input", () => {
    const result = sortGames(games, "score");
    expect(result.map((game) => game.id)).toEqual(["b", "c", "a"]);
    expect(games.map((game) => game.id)).toEqual(["a", "b", "c"]);
  });

  it("preserves input order when sort values are equal", () => {
    const result = sortGames([
      makeGame({ id: "first", score: 0 }),
      makeGame({ id: "second", score: 0 }),
    ], "score");
    expect(result.map((game) => game.id)).toEqual(["first", "second"]);
  });

  it("sorts search results by relevance before quality", () => {
    const result = sortByRelevance([
      makeGame({ id: "x", title: "Super Ludo", quality: 0.9 }),
      makeGame({ id: "y", title: "Ludo King", quality: 0.1 }),
    ], ["ludo"]);
    expect(result.map((game) => game.id)).toEqual(["y", "x"]);
  });
});

describe("image and URL state helpers", () => {
  it("resolves relative image paths against the configured CDN", () => {
    expect(resolveImageUrl("game/file.webp")).toBe("https://dl.lifelands.ir/game/file.webp");
  });

  it("round-trips URL view state", () => {
    const state = {
      query: "لودو ۲",
      sort: "score" as const,
      selections: { vendor: ["soroush"], score: ["4.5"] },
      favoritesOnly: true,
    };
    const parsed = parseViewState(new URLSearchParams(serializeViewState(state)));
    expect(parsed.query).toBe(state.query);
    expect(parsed.sort).toBe("score");
    expect(parsed.selections.vendor).toEqual(["soroush"]);
    expect(parsed.selections.score).toEqual(["4.5"]);
    expect(parsed.favoritesOnly).toBe(true);
  });
});

describe("mergePages", () => {
  it("deduplicates repeated IDs while preserving first-seen order", () => {
    const page = (id: number, games: string[]) => ({ pageId: id, eachPerPage: 2, total: 4, games: games.map((gameId) => makeGame({ id: gameId })) });
    expect(mergePages([page(1, ["a", "b"]), page(2, ["b", "c"])]).map((game) => game.id)).toEqual(["a", "b", "c"]);
  });
});
