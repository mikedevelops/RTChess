import Transaction, { SerialisedTransaction } from './Transaction';
import Piece from '../GameObject/Piece/Piece';
import Tile from '../GameObject/Board/Tile';
import Board from '../GameObject/Board/Board';
import MoveTransaction, { SerialisedMoveTransaction } from './MoveTransaction';

export default class TransactionManager {
  // TODO: benchmark string vs number key
  private transactions: Transaction[] = [];
  private history: SerialisedTransaction[] = [];

  public createMoveTransaction(board: Board, piece: Piece, tile: Tile): MoveTransaction {
    const createdAt = Date.now();
    const transaction = new MoveTransaction(createdAt, board, piece, tile);

    this.transactions.push(transaction);

    return transaction;
  }

  public getMoveTransactions(): SerialisedMoveTransaction[] {
    const moves: SerialisedMoveTransaction[] = [];

    for (const transaction of this.history) {
        // TODO: type guard here eventually
        moves.push(transaction as SerialisedMoveTransaction);
    }

    return moves;
  }

  public update(): void {
    for (const transaction of this.transactions) {
      transaction.resolve().then(resolved => {
        transaction.setResolved(resolved);
        this.updateHistory(transaction);
      });
    }

    this.clear();
  }

  private updateHistory(transaction: Transaction): void {
    const historyEntry = this.history.find(st => st.createdAt === transaction.getCreatedAt());

    if (historyEntry === undefined) {
      this.history.push(transaction.serialise());

      return;
    }

    historyEntry.state = transaction.getState();
    historyEntry.resolvedAt = transaction.getResolvedAt();
  }

  private clear(): void {
    this.history = this.history.concat(this.transactions.map(t => t.serialise()));
    this.transactions = [];
  }
}
