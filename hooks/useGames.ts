"use client";

import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import { fetchGamesPageFromProxy } from "@/lib/api/client";
import type { Game, GamesPage } from "@/lib/game";
import { mergePages } from "@/lib/merge";
import { getPaginationInfo } from "@/lib/pagination";

export const GAMES_QUERY_KEY = ["games"] as const;

export type GamesView = {
  readonly games: readonly Game[];
  readonly total: number;
};

function toView(data: InfiniteData<GamesPage, number>): GamesView {
  const lastPage = data.pages[data.pages.length - 1];
  return { games: mergePages(data.pages), total: lastPage.total };
}

function nextPageParam(lastPage: GamesPage): number | null {
  const received = lastPage.games.length;
  return getPaginationInfo(lastPage, received).nextPage;
}

export function useGames(initialPage: GamesPage) {
  return useInfiniteQuery({
    queryKey: GAMES_QUERY_KEY,
    queryFn: ({ pageParam, signal }) => fetchGamesPageFromProxy(pageParam, signal),
    initialPageParam: 1,
    initialData: { pages: [initialPage], pageParams: [1] },
    getNextPageParam: nextPageParam,
    select: toView,
  });
}
