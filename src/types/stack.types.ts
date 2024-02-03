export interface IStack<T> {
  push: (item: T) => void;
  pop: () => T | undefined;
  clear: () => void;
  getElements: () => T[] | null;
  getSize: () => number;
};

// Для связного списка...
export interface RegularStackNode<T> {
  value: T,
  on: RegularStackNode<T>,
};

export interface IStack2<T, N extends RegularStackNode<T> = RegularStackNode<T>> {
  push: (item: T) => void;
  pop: () => T | undefined;
  clear: () => void;
  isEmpty: boolean;
};