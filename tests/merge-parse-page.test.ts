import { parseGamesPage } from "../lib/api/parse-page";
import type { GamesPage } from "../lib/game";
import { mergePages } from "../lib/merge";
import { makeGame } from "./fixtures";

const pageOf = (pageId: number, ids: string[]): GamesPage => ({
  pageId,
  eachPerPage: 12,
  total: 726,
  games: ids.map((id) => makeGame({ id })),
});

describe("mergePages", () => {
  it("keeps order and removes games repeated across pages", () => {
    const merged = mergePages([pageOf(1, ["a", "b"]), pageOf(2, ["b", "c"])]);
    expect(merged.map((game) => game.id)).toEqual(["a", "b", "c"]);
  });
});

describe("parseGamesPage", () => {
  it("accepts what the proxy sends", () => {
    const page = pageOf(2, ["a", "b"]);
    expect(parseGamesPage(JSON.parse(JSON.stringify(page)))).toEqual(page);
  });

  it("rejects a game with a wrong field type", () => {
    const body = JSON.parse(JSON.stringify(pageOf(1, ["a"])));
    body.games[0].score = "4.5";
    expect(() => parseGamesPage(body)).toThrow();
  });
});
