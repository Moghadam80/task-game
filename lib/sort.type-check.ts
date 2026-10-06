import type { SortKey } from "./sort";

type Expect<T extends true> = T;
type IsAssignable<Value, Target> = [Value] extends [Target] ? true : false;
type Not<T extends boolean> = T extends true ? false : true;

export type SortKeyChecks = [
  Expect<IsAssignable<"runCount", SortKey>>,
  Expect<IsAssignable<"quality", SortKey>>,
  Expect<Not<IsAssignable<"title", SortKey>>>,
  Expect<Not<IsAssignable<"vendors", SortKey>>>,
];
