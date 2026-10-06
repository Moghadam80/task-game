import type { Game } from "./game";
import { UNSPECIFIED_VENDOR, vendorLabel } from "./vendors";

type MultiFilter = {
  readonly kind: "multi";
  readonly id: string;
  readonly label: string;
  readonly getValues: (game: Game) => readonly string[];
  readonly labelFor: (value: string) => string;
};

type MinFilter = {
  readonly kind: "min";
  readonly id: string;
  readonly label: string;
  readonly getValue: (game: Game) => number;
  readonly steps: readonly number[];
};

export type FilterDefinition = MultiFilter | MinFilter;

const identity = (value: string): string => value;

export const FILTER_DEFINITIONS = [
  {
    kind: "multi",
    id: "vendor",
    label: "پلتفرم",
    getValues: (game) => (game.vendors.length > 0 ? game.vendors : [UNSPECIFIED_VENDOR]),
    labelFor: vendorLabel,
  },
  {
    kind: "multi",
    id: "category",
    label: "دسته‌بندی",
    getValues: (game) => [game.categoryTitle],
    labelFor: identity,
  },
  {
    kind: "min",
    id: "score",
    label: "حداقل امتیاز",
    getValue: (game) => game.score,
    steps: [3, 3.5, 4, 4.5],
  },
  {
    kind: "multi",
    id: "orientation",
    label: "جهت نمایش",
    getValues: (game) => [game.orientation],
    labelFor: (value) => (value === "landscape" ? "افقی" : "عمودی"),
  },
] as const satisfies readonly FilterDefinition[];

export type FilterId = (typeof FILTER_DEFINITIONS)[number]["id"];

export type FilterSelections = Readonly<Partial<Record<FilterId, readonly string[]>>>;
