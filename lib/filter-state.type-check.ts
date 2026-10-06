import type { FilterState } from "./filter-state";

type Expect<T extends true> = T;
type IsAssignable<Value, Target> = [Value] extends [Target] ? true : false;
type Not<T extends boolean> = T extends true ? false : true;

type BrowseWithRelevance = { mode: "browse"; sort: "relevance" };
type SearchWithoutQuery = { mode: "search"; sort: "score" };
type BrowseByScore = { mode: "browse"; sort: "score" };
type SearchByRelevance = { mode: "search"; query: string; sort: "relevance" };

export type FilterStateChecks = [
  Expect<IsAssignable<BrowseByScore, FilterState>>,
  Expect<IsAssignable<SearchByRelevance, FilterState>>,
  Expect<Not<IsAssignable<BrowseWithRelevance, FilterState>>>,
  Expect<Not<IsAssignable<SearchWithoutQuery, FilterState>>>,
];
