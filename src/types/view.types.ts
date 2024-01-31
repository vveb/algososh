import { ElementStates } from "./element-states";

export type ViewItem<T extends string | number> = {
  value: T,
  state: ElementStates,
};