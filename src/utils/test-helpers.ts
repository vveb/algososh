import { nanoid } from "nanoid";
import { ViewItem } from "../types/view.types";
import { ElementStates } from "../types/element-states";

export const getGeneratorResult = (generator: Generator<ViewItem<number | string>[], void, never>): ViewItem<number | string>[] | undefined => {
  let current = generator.next();
  let res: ViewItem<number | string>[] = [];
  while (!current.done) {
    res = current.value;
    current = generator.next();
  };
  return res;
};

export const makeTestViewItemNumber = (value: number, state: ElementStates): ViewItem<number> => ({
  value: value,
  state: state,
  key: nanoid(8),
});

export const makeTestViewItemString = (value: string, state: ElementStates): ViewItem<string> => ({
  value: value,
  state: state,
  key: nanoid(8),
});

//Рабочий вариант функции без типизации

// export const getGeneratorResult = (generator: Generator) => {
//   let current = generator.next();
//   let actual;
//   while (!current.done) {
//     actual = current.value;
//     current = generator.next();
//   };
//   return actual;
// };