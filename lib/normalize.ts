const ARABIC_YEH = /[\u064A\u0649]/g;
const ARABIC_KAF = /\u0643/g;
const PERSIAN_DIGITS = /[\u06F0-\u06F9]/g;
const ARABIC_DIGITS = /[\u0660-\u0669]/g;
const ZWNJ = /\u200C/g;
const WHITESPACE = /\s+/g;

export function normalizePersian(input: string): string {
  return input
    .replace(ARABIC_YEH, "\u06CC")
    .replace(ARABIC_KAF, "\u06A9")
    .replace(PERSIAN_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(ARABIC_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(ZWNJ, "")
    .replace(WHITESPACE, " ")
    .trim()
    .toLowerCase();
}

export function queryTokens(query: string): string[] {
  const normalized = normalizePersian(query);
  return normalized === "" ? [] : normalized.split(" ");
}
