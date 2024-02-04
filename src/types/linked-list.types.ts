export interface ILinkedListNode<T> {
  value: T,
  next: ILinkedListNode<T> | null,
};

export interface ILinkedList<T> {
  prepend: (item: T) => void,
  append: (item: T) => void,
  addByIndex: (item: T, index: number) => void,
  deleteByIndex: (index: number) => void,
  deleteHead: () => void,
  deleteTail: () => void,
  toArray: () => ILinkedListNode<T>[] | null,
  isEmpty: boolean,
};

export enum LinkedListActions {
  AddToHead = "addToHead",
  AddToTail = "addToTail",
  DeleteFromHead = "deleteFromHead",
  DeleteFromTail = "deleteFromTail",
  AddAtIndex = 'addAtIndex',
  DeleteFromIndex = 'deleteFromIndex',
};

export type LinkedListIsAnimated = {
  isAddToHeadAnimating: boolean,
  isAddToTailAnimating: boolean,
  isDeleteFromHeadAnimating: boolean,
  isDeleteFromTailAnimating: boolean,
  isAddAtIndexAnimating: boolean,
  isDeleteFromIndexAnimating: boolean,
};