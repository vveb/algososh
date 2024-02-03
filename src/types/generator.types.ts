import { ViewItem } from "./view.types";

export type IterableViewWithNumbers = Generator<ViewItem<number>[], void, never>;
export type IterableViewWithStrings = Generator<ViewItem<string>[], void, never>;