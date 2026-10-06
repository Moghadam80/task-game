"use client";

import { memo, useCallback } from "react";
import type { Game } from "@/lib/game";
import { GameImage } from "./GameImage";
import { CARD_BODY_CLASS, CARD_CLASS } from "./layout";

const scoreFormat = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });
const countFormat = new Intl.NumberFormat("fa-IR");

type GameCardProps = {
  readonly game: Game;
  readonly eager: boolean;
  readonly isFavorite: boolean;
  readonly onToggleFavorite: (id: string) => void;
};

function triggerFavoriteFeedback() {
  if (typeof window === "undefined" || !navigator.vibrate) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  navigator.vibrate(8);
}

export const GameCard = memo(function GameCard({ game, eager, isFavorite, onToggleFavorite }: GameCardProps) {
  const handleFavorite = useCallback(() => {
    triggerFavoriteFeedback();
    onToggleFavorite(game.id);
  }, [game.id, onToggleFavorite]);

  return (
    <li className={CARD_CLASS}>
      <div className="relative overflow-hidden">
        <GameImage path={game.imagePath} title={game.title} eager={eager} />
        <button
          type="button"
          aria-label={isFavorite ? `حذف ${game.title} از علاقه‌مندی‌ها` : `افزودن ${game.title} به علاقه‌مندی‌ها`}
          aria-pressed={isFavorite}
          onClick={handleFavorite}
          className={`absolute left-3 top-3 flex size-10 items-center justify-center rounded-full border shadow-lg backdrop-blur-md transition duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${isFavorite ? "border-amber-300 bg-amber-50/95 text-amber-500 dark:border-amber-700 dark:bg-amber-950/90" : "border-white/70 bg-white/85 text-zinc-600 dark:border-zinc-700/80 dark:bg-zinc-950/80 dark:text-zinc-300"}`}
        >
          <span className={`text-xl leading-none transition-transform motion-reduce:transition-none ${isFavorite ? "scale-110" : ""}`} aria-hidden="true">{isFavorite ? "★" : "☆"}</span>
        </button>
        <span className="absolute right-3 top-3 rounded-full bg-zinc-950/65 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">{game.orientation === "landscape" ? "افقی" : "عمودی"}</span>
      </div>

      <div className={CARD_BODY_CLASS}>
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
            <p className="truncate text-[11px] font-medium text-blue-600 dark:text-blue-400"><bdi>{game.categoryTitle || "بدون دسته"}</bdi></p>
          </div>
          <h3 className="truncate text-sm font-bold text-zinc-900 dark:text-white"><bdi>{game.title}</bdi></h3>
          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400"><bdi>{game.companyName}</bdi></p>
        </div>

        <dl className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-amber-500">★</span>
            <dt className="sr-only">امتیاز</dt>
            <dd className="font-bold text-zinc-800 dark:text-zinc-100">{game.score > 0 ? scoreFormat.format(game.score) : "—"}</dd>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 15.5h12M5 13V9m3 4V6m3 7V8m3 5V4" /></svg>
            <dt className="sr-only">تعداد اجرا</dt>
            <dd>{countFormat.format(game.runCount)}</dd>
          </div>
          <div className="hidden items-center gap-1.5 text-zinc-500 dark:text-zinc-400 sm:flex">
            <span aria-hidden="true">♥</span>
            <dt className="sr-only">پسند</dt>
            <dd>{countFormat.format(game.like)}</dd>
          </div>
        </dl>
      </div>
    </li>
  );
});
