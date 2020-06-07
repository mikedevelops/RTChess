import Transaction from './Transaction';
import { SerialisedTransaction, TransactionType } from '../../../RTChessCore/src/Transaction/Transaction';

export default class InitialiseTransaction extends Transaction {
  getType(): TransactionType {
    return TransactionType.INITIALISE;
  }

  resolve(): Promise<boolean> {
    return Promise.resolve(false);
  }

  serialise(): SerialisedTransaction {
    return {
      createdAt: this.getCreatedAt(),
      state: this.getState(),
      type: this.getType(),
      player: this.getPlayer().serialise(),
      resolvedAt: this.getResolvedAt()
    };
  }
}
