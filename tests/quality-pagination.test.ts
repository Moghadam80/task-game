import { getPaginationInfo } from "../lib/pagination";
import { computeQuality } from "../lib/quality";

describe("computeQuality", () => {
  it("blends score, rating and likes", () => {
    expect(computeQuality({ score: 4.9, rating: 0.95, like: 11 })).toBeCloseTo(0.886, 2);
  });

  it("falls back to rating when score is 0", () => {
    const withoutScore = computeQuality({ score: 0, rating: 0.8, like: 0 });
    expect(withoutScore).toBeCloseTo(0.6, 2);
  });

  it("returns 0 when every signal is missing", () => {
    expect(computeQuality({ score: 0, rating: 0, like: 0 })).toBe(0);
  });
});

describe("getPaginationInfo", () => {
  const meta = { eachPerPage: 12, total: 726 };

  it("computes pages and the next page", () => {
    const info = getPaginationInfo({ ...meta, pageId: 1 }, 12);
    expect(info.totalPages).toBe(61);
    expect(info.nextPage).toBe(2);
    expect(info.countMismatch).toBe(false);
  });

  it("expects a shorter last page", () => {
    const info = getPaginationInfo({ ...meta, pageId: 61 }, 6);
    expect(info.hasMore).toBe(false);
    expect(info.countMismatch).toBe(false);
  });

  it("stops loading when a page comes back empty", () => {
    const info = getPaginationInfo({ ...meta, pageId: 3 }, 0);
    expect(info.hasMore).toBe(false);
    expect(info.countMismatch).toBe(true);
  });
});
