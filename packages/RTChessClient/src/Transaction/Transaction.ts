export enum TransactionType {
  MOVE = "MOVE",
}

export enum TransactionState {
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
  REJECTED = "REJECTED",
}

export interface SerialisedTransaction {
  createdAt: number;
  resolvedAt: number | null;
  state: TransactionState;
  type: TransactionType;
}

export default abstract class Transaction {
  protected state: TransactionState = TransactionState.PENDING;
  protected resolvedAt: null | number = null;

  protected constructor(protected createdAt: number) {}

  public abstract getType(): TransactionType;
  public abstract resolve(): Promise<boolean>;
  public abstract serialise(): SerialisedTransaction;

  public getState(): TransactionState {
    return this.state;
  }

  public setResolved(resolved: boolean): void {
    // TODO: Abstract for BC
    this.resolvedAt = Date.now();
    this.state = resolved ? TransactionState.COMPLETE : TransactionState.REJECTED;
  }

  public getCreatedAt(): number {
    return this.createdAt;
  }

  public getResolvedAt(): number | null {
    return this.resolvedAt;
  }
}
