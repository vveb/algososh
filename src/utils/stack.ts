import { IStack } from "../types/stack.types";

//Можно реализовать стек на основе связного списка, тогда временная сложность будет всегда O(1)

class Stack<T> implements IStack<T> {

  private container: T[] = [];

  private _containerIsNotEmpty = (): boolean => {
    return !!this.container.length;
  };

  public push = (item: T): void => {
    this.container.push(item);
  };

  public pop = (): T | undefined => {
    if (this._containerIsNotEmpty()) {
      return this.container.pop();
    };
    return undefined;
  };

  public clear = (): void => {
    this.container = [];
  };

  public getElements = (): T[] | null => {
    if (this._containerIsNotEmpty()) {
      return [...this.container];
    };
    return null;
  };

  public getSize = (): number => {
    return this.container.length;
  };
};

export default Stack;