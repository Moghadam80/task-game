import { filterGames, type FilterCriteria } from "../lib/filter";
import { selectGames } from "../lib/filter-state";
import { queryTokens } from "../lib/normalize";
import { makeGame } from "./fixtures";

const noFilters: FilterCriteria = {
  tokens: [],
  selections: {},
  favoritesOnly: false,
  favoriteIds: new Set<string>(),
};

const games = [
  makeGame({ id: "a", title: "Epic Ludo", companyName: "Vahid Ebrahimi", vendors: ["soroush"] }),
  makeGame({ id: "b", title: "لودو ۲", companyName: "Lifelands", vendors: [], categoryTitle: "معمایی" }),
  makeGame({ id: "c", title: "Nut Sort", companyName: "Vahid", vendors: ["rubika"], score: 4.6 }),
];

describe("filterGames", () => {
  it("matches title or company after Persian normalization", () => {
    const byTitle = filterGames(games, { ...noFilters, tokens: queryTokens("لودو 2") });
    const byCompany = filterGames(games, { ...noFilters, tokens: queryTokens("vahid") });
    expect(byTitle.map((game) => game.id)).toEqual(["b"]);
    expect(byCompany.map((game) => game.id)).toEqual(["a", "c"]);
  });

  it("treats empty vendor arrays as an unspecified bucket", () => {
    const unspecified = filterGames(games, { ...noFilters, selections: { vendor: ["unspecified"] } });
    const soroush = filterGames(games, { ...noFilters, selections: { vendor: ["soroush"] } });
    expect(unspecified.map((game) => game.id)).toEqual(["b"]);
    expect(soroush.map((game) => game.id)).toEqual(["a"]);
  });

  it("combines filters with AND and supports the favorites-only filter", () => {
    const result = filterGames(games, {
      ...noFilters,
      selections: { score: ["4.5"] },
      favoritesOnly: true,
      favoriteIds: new Set(["c", "a"]),
    });
    expect(result.map((game) => game.id)).toEqual(["c"]);
  });
});

describe("selectGames", () => {
  it("ranks title prefix matches first in relevance mode", () => {
    const pool = [
      makeGame({ id: "x", title: "Super Ludo", quality: 0.9 }),
      makeGame({ id: "y", title: "Ludo King", quality: 0.1 }),
    ];
    const result = selectGames(pool, {
      state: { mode: "search", query: "ludo", sort: "relevance" },
      selections: {},
      favoritesOnly: false,
      favoriteIds: new Set<string>(),
    });
    expect(result.map((game) => game.id)).toEqual(["y", "x"]);
  });
});
