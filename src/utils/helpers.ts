import { nanoid } from "nanoid";
import { ElementStates } from "../types/element-states";
import { ViewItem } from "../types/view.types";

const makeInitialViewItem = (value: string): ViewItem<string> => ({
  value: value,
  state: ElementStates.Default,
  key: nanoid(8),
});

export const makeInitialView = (count: number, value: string = '', isRandom: boolean = false): ViewItem<string>[] => {
  let res: ViewItem<string>[] = [];
  for (let i=0; i<count; i++) {
    if (isRandom) {
      res.push(makeInitialViewItem(String(Math.floor(Math.random()*100+1))))
    } else {
      res.push(makeInitialViewItem(value));
    }
  };
  return res;
};