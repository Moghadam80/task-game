import { normalizePersian, queryTokens } from "../lib/normalize";

describe("normalizePersian", () => {
  it("unifies Arabic yeh and kaf with the Persian letters", () => {
    expect(normalizePersian("كتاب علي")).toBe("\u06A9\u062A\u0627\u0628 \u0639\u0644\u06CC");
  });

  it("converts Persian and Arabic digits to Latin digits", () => {
    expect(normalizePersian("بازی ۱۲۳ و ٤٥٦")).toBe("بازی 123 و 456");
  });

  it("removes ZWNJ and collapses whitespace", () => {
    expect(normalizePersian("  می\u200Cخواهم \n  بازی ")).toBe("میخواهم بازی");
  });

  it("lowercases Latin text so search is case-insensitive", () => {
    expect(normalizePersian("Epic LUDO")).toBe("epic ludo");
  });

  it("returns an empty token list for blank queries", () => {
    expect(queryTokens("  \u200C ")).toEqual([]);
  });
});
