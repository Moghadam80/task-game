import { parseGamesResponse } from "../lib/api/parse";

const rawGame = {
  _id: "6ab3c2f653831f2d16e07b22",
  title: "Epic Ludo",
  companyName: "Vahid Ebrahimi",
  image: "game/file-1790165936338.png",
  category: { title: "امتیازی " },
  vitrinThirdPartyVendors: ["soroush", "rubika", "unknown-store"],
  isLandscape: true,
  score: 0,
  rating: 0,
  like: 2,
  runCount: 518,
  seenCount: 762,
  level: 1,
  description: "   ",
};

describe("parseGamesResponse", () => {
  it("maps valid games and ignores unsupported vendor values", () => {
    const page = parseGamesResponse({
      state: true,
      data: { pageId: 1, eachPerPage: 12, total: 726, games: [rawGame] },
    });
    expect(page.games).toHaveLength(1);
    expect(page.games[0]?.categoryTitle).toBe("امتیازی");
    expect(page.games[0]?.vendors).toEqual(["soroush", "rubika"]);
  });

  it("accepts games where the API omits the vendor field", () => {
    const { vitrinThirdPartyVendors: omittedVendors, ...gameWithoutVendors } = rawGame;
    void omittedVendors;
    const page = parseGamesResponse({
      state: true,
      data: { pageId: 4, eachPerPage: 12, total: 726, games: [gameWithoutVendors] },
    });
    expect(page.games[0]?.vendors).toEqual([]);
  });

  it("uses a fallback company name when the API omits it", () => {
    const { companyName: omittedCompany, ...gameWithoutCompany } = rawGame;
    void omittedCompany;
    const page = parseGamesResponse({
      state: true,
      data: { pageId: 8, eachPerPage: 12, total: 726, games: [gameWithoutCompany] },
    });
    expect(page.games[0]?.companyName).toBe("Unknown");
  });

  it("rejects malformed items instead of silently changing pagination semantics", () => {
    expect(() =>
      parseGamesResponse({
        state: true,
        data: { pageId: 2, eachPerPage: 12, total: 726, games: [rawGame, { _id: 5 }] },
      }),
    ).toThrow();
  });

  it("rejects an unexpected envelope", () => {
    expect(() => parseGamesResponse({ state: false })).toThrow();
  });
});
