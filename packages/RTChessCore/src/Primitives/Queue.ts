export default class Queue<T> {
  constructor(private items: T[] = []) {}

  public clear(): void {
    this.items = [];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public enqueue(item: T): void {
    this.items.push(item);
  }

  public dequeue(): T {
    const item = this.items[0];

    this.items = this.items.slice(1);

    return item;
  }

  public peek(): T | null {
    if (this.items[0] === undefined) {
      return null;
    }

    return this.items[0];
  }

  public has(item: T): boolean {
    return this.items.find(i => i === item) !== undefined;
  }

  public toArray(): T[] {
    // TODO: Should we return a shallow/deep copy here?
    return this.items;
  }

  public getLength(): number {
    return this.items.length;
  }
}
