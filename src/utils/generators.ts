import { ElementStates } from "../types/element-states";
import { ViewItem } from "../types/view.types";

export function* reverseStringGenerator(str: string): Generator<ViewItem<string>[], void, never> {
  let current: string[] = str.split('');
  let res: ViewItem<string>[] = current.map((letter) => ({value: letter, state: ElementStates.Default}));
  let temp;
  yield [...res];
  for (let i=0; i < Math.floor(current.length/2); i++) {
    const last = current.length-1 - i;
    res[i].state = ElementStates.Changing;
    res[last].state = ElementStates.Changing;
    yield [...res];
    temp = current[i];
    res[i].value = res[res.length-i-1].value;
    res[res.length-i-1].value = temp;
    yield [...res];
    res[i].state = ElementStates.Modified;
    res[last].state = ElementStates.Modified;
    yield [...res];
  };
  if (Boolean(current.length % 2)) {
    res[Math.floor(current.length/2)].state = ElementStates.Changing;
    yield [...res];
    res[Math.floor(current.length/2)].state = ElementStates.Modified;
    yield [...res];
  };
};