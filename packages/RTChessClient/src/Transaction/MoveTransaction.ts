import Tile from "../GameObject/Board/Tile";
import Piece from "../GameObject/Piece/Piece";
import DisplayBoard from "../GameObject/Board/DisplayBoard";
import Transaction from './Transaction';
import { TransactionType, SerialisedMoveTransaction, PlayerCore } from 'rtchess-core';

export default class MoveTransaction extends Transaction {
  constructor(
    createdAt: number,
    player: PlayerCore,
    private board: DisplayBoard,
    private piece: Piece,
    private tile: Tile
  ) {
    super(createdAt, player);
  }

  public serialise(): SerialisedMoveTransaction {
    return {
      piece: this.piece.getName(),
      from: this.piece.getCoords().toString(),
      to: this.tile.getCoords().toString(),
      state: this.state,
      type: this.getType(),
      createdAt: this.getCreatedAt(),
      resolvedAt: this.getResolvedAt(),
      player: this.getPlayer().serialise(),
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
