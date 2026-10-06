import type { Game } from "./game";

const MAX_SCORE = 5;
const LIKE_SATURATION = 50;
const WEIGHTS = { score: 0.5, rating: 0.25, like: 0.25 } as const;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function computeQuality(input: Pick<Game, "score" | "rating" | "like">): number {
  const rating = clamp01(input.rating);
  const scoreSignal = input.score > 0 ? clamp01(input.score / MAX_SCORE) : rating;
  const likeSignal = clamp01(
    Math.log1p(Math.max(0, input.like)) / Math.log1p(LIKE_SATURATION),
  );
  return WEIGHTS.score * scoreSignal + WEIGHTS.rating * rating + WEIGHTS.like * likeSignal;
}
