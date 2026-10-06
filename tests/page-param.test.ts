import { parsePageParam } from "../lib/page-param";

describe("parsePageParam", () => {
  it("defaults to the first page when the parameter is missing", () => {
    expect(parsePageParam(null)).toBe(1);
  });

  it("accepts positive integers", () => {
    expect(parsePageParam("2")).toBe(2);
    expect(parsePageParam("61")).toBe(61);
  });

  it("rejects zero, negatives, decimals, text and huge values", () => {
    expect(parsePageParam("0")).toBe(null);
    expect(parsePageParam("-1")).toBe(null);
    expect(parsePageParam("1.5")).toBe(null);
    expect(parsePageParam("abc")).toBe(null);
    expect(parsePageParam("99999999")).toBe(null);
  });
});
