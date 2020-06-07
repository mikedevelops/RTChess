import { SerialisedTransaction, TransactionState, TransactionType } from '../../../RTChessCore/src/Transaction/Transaction';
import { PlayerCore } from '../../../RTChessCore/src/Player/Player';

export default abstract class Transaction {
  protected state: TransactionState = TransactionState.PENDING;
  protected resolvedAt: null | number = null;

  constructor(protected createdAt: number, protected player: PlayerCore) {}

  public abstract getType(): TransactionType;
  public abstract resolve(): Promise<boolean>;
  public abstract serialise(): SerialisedTransaction;

  public getState(): TransactionState {
    return this.state;
  }

  public getPlayer(): PlayerCore {
    return this.player;
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
