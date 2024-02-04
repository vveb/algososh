export interface IQueueNode<T> {
  value: T,
  next: IQueueNode<T> | null,
};

export interface IQueue<T> {
  enqueue: (item: T) => void;
  dequeue: () => T | null;
  clear: () => void;
  isEmpty: boolean,
};

export type QueueIsAnimated = {
  isEnqueueAnimating: boolean,
  isDequeueAnimating: boolean,
  isClearAnimating: boolean,
};