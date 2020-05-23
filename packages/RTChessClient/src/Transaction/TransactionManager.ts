import Piece from '../GameObject/Piece/Piece';
import Tile from '../GameObject/Board/Tile';
import DisplayBoard from '../GameObject/Board/DisplayBoard';
import MoveTransaction from './MoveTransaction';
import Transaction from './Transaction';
import InitialiseTransaction from './InitialiseTransaction';
import Socket = SocketIOClient.Socket;
import { SerialisedTransaction, PlayerCore, TransactionType } from 'rtchess-core';

export default class TransactionManager {
  // TODO: benchmark string vs number key
  private transactions: Transaction[] = [];
  private history: SerialisedTransaction[] = [];

  //constructor(private socket: Socket) {}

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
    piece: Piece,
    tile: Tile
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
    this.history = this.history.concat(this.transactions.map((t: Transaction) => t.serialise()));
    this.transactions = [];
  }
}
