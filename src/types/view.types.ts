import { ElementStates } from "./element-states";

export type ViewItem<T extends string | number> = {
  value: T,
  state: ElementStates,
  key: string,
  head?: string | ViewItem<T> | null,
  tail?: string | ViewItem<T> | null,
};