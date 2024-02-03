import { IQueue, IQueueNode } from "../types/queue.types";

//Можно реализовать стек на основе связного списка, тогда временная сложность будет всегда O(1)

class QueueNode<T> implements IQueueNode<T> {

  public value: T;
  public next: QueueNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  };
};

class Queue<T> implements IQueue<T> {

  private head: QueueNode<T> | null = null;
  private tail: QueueNode<T> | null = null;
  private length: number = 0;

  public get isEmpty() {
    return this.head === null && this.tail === null;
  };

  public get size() {
    return this.length;
  }

  public enqueue (item: T): void {
    const node = new QueueNode(item);
    if (this.isEmpty) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.tail;
      this.tail = node;
    }
    this.length++;
  };
  
  public dequeue (): T | null {
    if (this.isEmpty) {
      return null
    };
    if (this.head === this.tail) {
      const value = this.tail ? this.tail.value : null;
      this.head = null;
      this.tail = null;
      this.length--;
      return value;
    }
    let prev = this.tail;
    let current = this.tail?.next;
    while (current && current.next) {
      prev = current;
      current = current.next;
    }
    if (prev) {
      this.head = prev;
      this.head.next = null;
      this.length--;
      return current ? current.value : null;
    };
    return null;
  };

  clear = (): void => {
    this.head = null;
    this.tail = null;
    this.length = 0;
  };
};

export default Queue;