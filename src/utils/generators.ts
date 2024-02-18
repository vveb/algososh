import { nanoid } from "nanoid";
import { ElementStates } from "../types/element-states";
import { ViewItem } from "../types/view.types";
import { IterableViewWithNumbers, IterableViewWithStrings } from "../types/generator.types";
import { Direction } from "../types/direction";
import { makeInitialViewItem } from "./helpers";

export function* reverseStringGenerator(str: string): IterableViewWithStrings {
  let current: string[] = str.split('');
  let res: ViewItem<string>[] = current.map((letter) => ({value: letter, state: ElementStates.Default, key: nanoid(8)}));
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

export function* calculateFiboGenerator(n: number): IterableViewWithNumbers {
  let res: ViewItem<number>[] = [];
  for (let i=0; i<=n; i++) {
    if (i < 2) {
      res.push({value: 1, state: ElementStates.Default, key: nanoid(8)});
      yield [...res];
    } else {
      const current = res[i-1].value + res[i-2].value;
      res.push({value: current, state: ElementStates.Default, key: nanoid(8)});
      yield [...res];
    };
  };
};

export function* selectionSortGenerator(arr: ViewItem<number>[], direction: Direction): IterableViewWithNumbers {
  let res: ViewItem<number>[] = arr;
  if (res.length === 0) {
    yield [...res];
    return;
  }
  for (let i=0; i < res.length-1; i++) {
    let targetIndex = i;
    res[targetIndex].state = ElementStates.Changing;
    for (let j=i+1; j < res.length; j++) {
      res[j].state = ElementStates.Changing;
      yield [...res]
      if (direction === Direction.Ascending) {
        if (res[j].value < res[targetIndex].value) {
          res[targetIndex].state = ElementStates.Default;
          targetIndex = j;
        } else {
          res[j].state = ElementStates.Default;
        }
      } else {
        if (res[j].value > res[targetIndex].value) {
          res[targetIndex].state = ElementStates.Default;
          targetIndex = j;
        } else {
          res[j].state = ElementStates.Default;
        };
      };
      yield [...res];
    }
    if (targetIndex === i) {
      res[i].state = ElementStates.Modified;
    } else {
      const temp = res[i].value;
      res[i].value = res[targetIndex].value;
      res[targetIndex].value = temp;
      res[i].state = ElementStates.Modified;
      res[targetIndex].state = ElementStates.Default;
    }
    yield [...res];
  }
  res[res.length-1].state = ElementStates.Modified;
  yield [...res];
};

export function* bubbleSortGenerator(arr: ViewItem<number>[], direction: Direction): IterableViewWithNumbers {
  let res: ViewItem<number>[] = arr;
  if (res.length === 0) {
    yield [...res];
    return;
  }
  for (let i=0; i<res.length-1; i++) {
    for (let j=0; j<res.length-i-1; j++) {
      res[j].state = ElementStates.Changing;
      res[j+1].state = ElementStates.Changing;
      yield [...res];
      if (direction === Direction.Ascending) {
        if (res[j].value > res[j+1].value) {
          const temp = res[j].value;
          res[j].value = res[j+1].value;
          res[j+1].value = temp;
        }
      } else {
        if (res[j].value < res[j+1].value) {
          const temp = res[j].value;
          res[j].value = res[j+1].value;
          res[j+1].value = temp;
        }
      }
      yield [...res];
      res[j].state = ElementStates.Default;
    };
    res[arr.length-i-1].state = ElementStates.Modified;
    yield [...res];
  };
  res[0].state = ElementStates.Modified;
  yield [...res]
};

export function* addElementToHeadGenerator (arr: ViewItem<string>[], value: string): IterableViewWithStrings {
  const item = makeInitialViewItem(value);
  if (arr.length === 0) {
    const newItem = makeInitialViewItem('');
    item.state = ElementStates.Changing;
    newItem.head = item;
    yield[newItem]
    newItem.head = '';
    newItem.value = value;
    newItem.state = ElementStates.Modified;
    yield[newItem]
    newItem.state = ElementStates.Default;
    yield[newItem]
    return
  }
  const [first, ...rest] = arr;
  if (first) {
    item.state = ElementStates.Changing;
    first.head = item;
    yield[first, ...rest]
  }
  item.state = ElementStates.Modified;
  first.head = ''
  yield[item, ...arr]
  item.state = ElementStates.Default;
  yield[item, ...arr]
}

export function* addElementToTailGenerator (arr: ViewItem<string>[], value: string): IterableViewWithStrings {
  const item = makeInitialViewItem(value);
  if (arr.length === 0) {
    const newItem = makeInitialViewItem('');
    item.state = ElementStates.Changing;
    newItem.head = item;
    yield[newItem]
    newItem.head = '';
    newItem.value = value;
    newItem.state = ElementStates.Modified;
    yield[newItem]
    newItem.state = ElementStates.Default;
    yield[newItem]
    return
  }
  const last = arr[arr.length-1]
  if (last) {
    item.state = ElementStates.Changing;
    last.head = item;
    yield[...arr.slice(0, arr.length-1), last]
  }
  item.state = ElementStates.Modified;
  last.head = '';
  yield[...arr, item];
  item.state = ElementStates.Default;
  yield[...arr, item];
};

export function* deleteElementFromHeadGenerator (arr: ViewItem<string>[]): IterableViewWithStrings {
  const [first, ...rest] = arr;
  if (first) {
    first.state = ElementStates.Changing;
    yield[...arr];
    first.tail = {...first};
    first.value = '';
    first.state = ElementStates.Default;
    yield[...arr];
    yield[...rest];
  };
};

export function* deleteElementFromTailGenerator (arr: ViewItem<string>[]): IterableViewWithStrings {
  const last = arr[arr.length-1]
  if (last) {
    last.state = ElementStates.Changing;
    yield[...arr];
    last.tail = {...last};
    last.value = '';
    last.state = ElementStates.Default;
    yield[...arr];
    yield[...arr.slice(0, arr.length-1)];
  };
};

export function* addElementAtIndexGenerator (arr: ViewItem<string>[], index: number, value: string): IterableViewWithStrings {
  const item = makeInitialViewItem(value);
  if (arr.length === 0) {
    const newItem = makeInitialViewItem('');
    item.state = ElementStates.Changing;
    newItem.head = item;
    yield[newItem]
    newItem.head = '';
    newItem.value = value;
    newItem.state = ElementStates.Modified;
    yield[newItem]
    newItem.state = ElementStates.Default;
    yield[newItem]
    return
  }
  const [first,] = arr;
  const begin = arr.slice(0, index);
  const end = arr.slice(index);
  item.state = ElementStates.Changing;
  first.head = item;
  yield[...arr]
  let currentIndex = 0;
  while(currentIndex !== index) {
    arr[currentIndex].state = ElementStates.Changing;
    arr[currentIndex].head = '';
    arr[currentIndex+1].head = item;
    currentIndex++;
    yield[...arr]
  }
  arr[currentIndex].head='';
  item.state = ElementStates.Modified;
  const res = [...begin, item, ...end]
  yield[...res]
  yield[...res.map((item) => ({...item, state: ElementStates.Default}))]
}

export function* deleteElementFromIndexGenerator (arr: ViewItem<string>[], index: number): IterableViewWithStrings {
  const begin = arr.slice(0, index);
  const end = arr.slice(index+1);
  let currentIndex = 0;
  while (currentIndex !== index) {
    arr[currentIndex].state = ElementStates.Changing;
    currentIndex++;
    yield[...arr];
  }
  arr[currentIndex].state = ElementStates.Changing;
  yield[...arr];
  arr[currentIndex].tail = {...arr[currentIndex]};
  arr[currentIndex].value = '';
  yield[...arr];
  const res = [...begin, ...end].map((item) => ({...item, state: ElementStates.Default}));
  yield[...res];
};