import { nanoid } from "nanoid";
import { ElementStates } from "../types/element-states";
import { ViewItem } from "../types/view.types";

export const makeInitialViewItem = (value: string): ViewItem<string> => ({
  value: value,
  state: ElementStates.Default,
  key: nanoid(8),
});

export const makeInitialView = (count: number): ViewItem<string>[] => {
  let res: ViewItem<string>[] = [];
  for (let i=0; i<count; i++) {
      res.push(makeInitialViewItem(''));
  };
  return res;
};