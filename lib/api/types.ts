export type ApiEnvelope<TData> = {
  readonly state: boolean;
  readonly data: TData;
};

export type PagedData<TItem> = {
  readonly pageId: number;
  readonly eachPerPage: number;
  readonly total: number;
  readonly games: readonly TItem[];
};

export type RawGame = {
  readonly _id: string;
  readonly title: string;
  readonly companyName?: string;
  readonly image: string;
  readonly category: { readonly title: string };
  readonly vitrinThirdPartyVendors?: readonly string[];
  readonly isLandscape: boolean;
  readonly score: number;
  readonly rating: number;
  readonly like: number;
  readonly runCount: number;
  readonly seenCount: number;
  readonly level: number;
  readonly description?: string;
};

export type RawGamesResponse = ApiEnvelope<PagedData<RawGame>>;
