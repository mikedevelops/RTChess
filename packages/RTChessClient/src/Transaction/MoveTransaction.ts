import Transaction, { SerialisedTransaction, TransactionType } from './Transaction';
import Tile from "../GameObject/Board/Tile";
import Piece from "../GameObject/Piece/Piece";
import Board from "../GameObject/Board/Board";

export interface SerialisedMoveTransaction extends SerialisedTransaction {
  createdAt: number;
  piece: string;
  from: string;
  to: string;
}

export default class MoveTransaction extends Transaction {
  constructor(
    createdAt: number,
    private board: Board,
    private piece: Piece,
    private tile: Tile
  ) {
    super(createdAt);
  }

  public serialise(): SerialisedMoveTransaction {
    return {
      piece: this.piece.getName(),
      from: this.piece.getCoords().toString(),
      to: this.tile.getCoords().toString(),
      state: this.state,
      type: this.getType(),
      createdAt: this.createdAt,
      resolvedAt: this.resolvedAt,
    };
  }

  public getPiece(): Piece {
    return this.piece;
  }

  public getTile(): Tile {
    return this.tile;
  }

  public getType(): TransactionType {
    return TransactionType.MOVE;
  }

  public async resolve(): Promise<boolean> {
    const oldTile = this.board.getTileAt(this.piece.getCoords());

    // If the tile the piece was on no lonfer exists!?
    if (oldTile === null) {
      // TODO: Logging
      return false;
    }

    // If we lost the battle!
    if (!(await this.canMove())) {
      return false;
    }

    const victim = this.tile.addPiece(this.piece);

    oldTile.removePiece(this.piece);
    this.piece.setMoved(true);
    this.piece.blur();

    if (victim !== null) {
      // TODO: do something with pieces that have been taken
    }

    return true;
  }

  private async canMove(): Promise<boolean> {
    return true;
  }
}
