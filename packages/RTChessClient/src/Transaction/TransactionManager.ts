import DisplayPiece from '../GameObject/Piece/DisplayPiece';
import DisplayTile from '../GameObject/Board/DisplayTile';
import DisplayBoard from '../GameObject/Board/DisplayBoard';
import MoveTransaction from './MoveTransaction';
import Transaction from './Transaction';
import InitialiseTransaction from './InitialiseTransaction';
import { SerialisedTransaction, TransactionType } from '../../../RTChessCore/src/Transaction/Transaction';
import { PlayerCore } from '../../../RTChessCore/src/Player/Player';

export default class TransactionManager {
  // TODO: benchmark string vs number key
  private transactions: Transaction[] = [];
  private history: SerialisedTransaction[] = [];

  public create(createdAt: number, player: PlayerCore, type: TransactionType): Transaction {
    switch(type) {
      case TransactionType.INITIALISE: {
        const transaction = new InitialiseTransaction(createdAt, player);

        this.transactions.push(transaction);

        return transaction;
      }
      default:
        throw new Error("Cannot create transaction!");
    }
  }

  public createMoveTransaction(
    createdAt: number,
    player: PlayerCore,
    board: DisplayBoard,
    piece: DisplayPiece,
    tile: DisplayTile
  ): MoveTransaction {
    const transaction = new MoveTransaction(createdAt, player, board, piece, tile);

    this.transactions.push(transaction);

    return transaction;
  }

  public getHistory(): SerialisedTransaction[] {
    return this.history;
  }

  public update(): void {
    if (this.transactions.length === 0) {
      return;
    }

    //this.socket.emit("client:transactions", this.transactions.map(t => t.serialise()));
    this.clear();
  }

  /*
  private updateHistory(transaction: Transaction): void {
    const historyEntry = this.history.find(st => st.createdAt === transaction.getCreatedAt());

    if (historyEntry === undefined) {
      this.history.push(transaction.serialise());

      return;
    }

    historyEntry.state = transaction.getState();
    historyEntry.resolvedAt = transaction.getResolvedAt();
  }
   */

  private clear(): void {
    this.history = this.history.concat(this.transactions.map((t: Transaction) => t.serialise()));
    this.transactions = [];
  }
}
