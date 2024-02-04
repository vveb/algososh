import { ILinkedList, ILinkedListNode } from "../types/linked-list.types";

class LinkedListNode<T> implements ILinkedListNode<T> {

  public value: T;
  public next: LinkedListNode<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
  };
};

class LinkedList<T> implements ILinkedList<T> {

  private head: LinkedListNode<T> | null;
  private length: number;

  constructor() {
    this.head = null;
    this.length = 0;
  }

  public get isEmpty() {
    return this.head === null && this.length===0;
  }

  public get size() {
    return this.length;
  }

  public prepend(item: T): void {
    const node = new LinkedListNode(item);
    if (this.isEmpty) {
      this.head = node
    } else {
      if (this.head) {
        node.next = this.head;
        this.head = node;
      };
    };
    this.length++;
  };

  public append(item: T): void {
    const node = new LinkedListNode(item);
    if (this.isEmpty) {
      this.head = node;
    } else {
      if (this.head) {
        let current = this.head
        while (current.next) {
          current = current.next
        }
        current.next = node;
      };
    };
    this.length++;
  };

  public deleteHead(): void {
    if (this.head) {
      if (this.head.next) {
        const next = this.head.next;
        this.head.next = null;
        this.head = next;
      } else {
        this.head = null;
      };
      this.length--;
    };
  };

  public deleteTail(): void {
    if (this.head) {
      if (this.head.next) {
        let prev = this.head;
        let current = this.head.next;
        while (current.next) {
          prev = current;
          current = current.next
        }
        prev.next = null;
      } else {
        this.head = null;
      };
      this.length--;
    };
  };

  public addByIndex(item: T, index: number): void {
    if (index < 0 || index > this.size) {
      return;
    }
    const node = new LinkedListNode(item);
    if (index === 0) {
      node.next = this.head;
      this.head = node;
    } else {
      let current = this.head;
      let currentIndex = 0;
      while(currentIndex !== index-1) {
        if (current) {
          current = current.next;
          currentIndex++;
        };
      };
      if (current) {
        node.next = current.next;
        current.next = node;
      };
    };
    this.length++;
  };

  public deleteByIndex(index: number): void {
    if (index < 0 || index >= this.size) {
      return;
    };
    if (index === 0 && this.head) {
      const next = this.head.next
      this.head.next = null;
      this.head = next;
    } else if (this.head) {
      let prev = this.head
      let current = this.head.next;
      let currentIndex = 1;
      while (currentIndex !== index) {
        if (current) {
          prev = current;
          current = current.next;
          currentIndex++;
        }
      }
      if (current) {
        prev.next = current.next;
        current.next = null;
      };
    };
    this.length--;
  };

  public  toArray(): LinkedListNode<T>[] | null {
    let res = [];
    if (this.isEmpty) {
      return null;
    } else {
      let current = this.head;
      while (current) {
        res.push(current);
        current = current.next;
      }
      return res;
    }
  };
}

export default LinkedList;