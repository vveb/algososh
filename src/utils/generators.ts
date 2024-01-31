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

export function* calculateFiboGenerator(n: number): Generator<ViewItem<number>[], void, never> {
  let res: ViewItem<number>[] = [];
  for (let i=0; i<n; i++) {
    if (i < 2) {
      res.push({value: 1, state: ElementStates.Default});
      yield [...res];
    } else {
      const current = res[i-1].value + res[i-2].value;
      res.push({value: current, state: ElementStates.Default});
      yield [...res];
    }
  }
}