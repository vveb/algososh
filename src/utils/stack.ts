import { IStack } from "../types/stack.types";

//Можно реализовать стек на основе связного списка, тогда временная сложность будет всегда O(1)

class Stack<T> implements IStack<T> {

  private container: T[] = [];

  _containerIsNotEmpty = (): boolean => {
    return !!this.container.length;
  };

  push = (item: T): void => {
    this.container.push(item);
  };

  pop = (): T | undefined => {
    if (this._containerIsNotEmpty()) {
      return this.container.pop();
    };
    return undefined;
  };

  clear = (): void => {
    this.container = [];
  };

  getElements = (): T[] | null => {
    if (this._containerIsNotEmpty()) {
      return [...this.container];
    };
    return null;
  };

  getSize = (): number => {
    return this.container.length;
  };
};

export default Stack;