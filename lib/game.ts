import type { Vendor } from "./vendors";

export type Orientation = "landscape" | "portrait";

export type Game = {
  readonly id: string;
  readonly title: string;
  readonly companyName: string;
  readonly categoryTitle: string;
  readonly description: string;
  readonly imagePath: string;
  readonly vendors: readonly Vendor[];
  readonly orientation: Orientation;
  readonly score: number;
  readonly rating: number;
  readonly like: number;
  readonly runCount: number;
  readonly seenCount: number;
  readonly level: number;
  readonly quality: number;
  readonly titleKey: string;
  readonly companyKey: string;
};

export type GamesPage = {
  readonly pageId: number;
  readonly eachPerPage: number;
  readonly total: number;
  readonly games: readonly Game[];
};
