import Entity from "../../Object/Entity";
import WillDraw from "../../Object/WillDraw";
import WillDebug from "../../Object/WillDebug";
import DisplayTile from "./DisplayTile";
import DisplayPiece, { PieceOwner } from '../Piece/DisplayPiece';
import ClientRuntime, { RuntimeFlag } from "../../Runtime/ClientRuntime";
import { SortLayer } from "../../Renderer/Renderer";
import Rect from '../../../../RTChessCore/src/Primitives/Rect';
import Vector2 from '../../../../RTChessCore/src/Primitives/Vector2';
import { getEntityId } from '../../Runtime/EntityManager';
import Pawn from '../Piece/Pawn';

export default class DisplayBoard extends Entity implements WillDraw, WillDebug {
  private tiles: Map<string, DisplayTile> = new Map();
  private pieces: Map<string, DisplayPiece> = new Map();
  private width: number = 4;
  private height: number = 4;
  private activePiece: DisplayPiece | null = null;

  public setState(data: { [index: number]: number }): void {
  }

  public getSortLayer(): SortLayer {
    return SortLayer.BOARD;
  }

  public getPieces(): DisplayPiece[] {
    return [...this.pieces.values()];
  }

  public getTiles(): DisplayTile[] {
    return [...this.tiles.values()];
  }

  public getPieceAtPosition(position: Vector2): DisplayPiece | null {
    for (const tile of this.getTiles()) {
      if (position.isInside(tile.getClickableRect())) {
        return tile.getPiece();
      }
    }

    return null;
  }

  public getWorldPosition(): Vector2 {
    return super.getWorldPosition().add(Vector2.unit(0, this.height -1, DisplayTile.SIZE));
  }

  public selectTileAtWorldPosition(position: Vector2): void {
    const tile = this.getTileAtWorldPosition(position);

    if (tile === null) {
      return;
    }

    const piece = tile.getPiece();
    const canFocusPiece = piece !== null && !piece.isOpponentPiece() ||
    (piece !== null && ClientRuntime.instance.hasFlag(RuntimeFlag.SINGLE_PLAYER) && ClientRuntime.instance.isDebugMode());

    // If there is no current active piece
    if (this.activePiece === null) {
      // If we selected a piece that belongs to us
        if (canFocusPiece) {
          this.activePiece = piece;
          // TODO: I feel as though typescript should be able to know this is
          // not null??? Is my condition wrong? Seems okay to me...
          (piece as DisplayPiece).focus();
        }

      return;
    // If there is an active piece
    } else {
      // determine if we can move to the tile
      for (const move of ClientRuntime.instance.getAvailableMoves(this.activePiece)) {
        if (tile.getCoords().equals(move)) {
          this.movePiece(this.activePiece, tile);
          this.activePiece = null;

          return;
        }
      }

      this.activePiece.blur();
      this.activePiece = null;

      // if we clicked another piece
      if (canFocusPiece) {
        this.activePiece = piece;
        (piece as DisplayPiece).focus();
      }
    }
  }

  public movePiece(piece: DisplayPiece, tile: DisplayTile): void {
    ClientRuntime.instance.createMoveTransaction(piece, tile);
  }

  public start(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const tile = new DisplayTile(new Vector2(x, y));
        this.tiles.set(tile.getId(), tile);
        this.addChild(tile);
      }
    }

    // TODO: We should define a starting position and then just mirror
    // it at the other end of the board.
    //
    // - IDEA
    //  - A mode where player can swap (n) piece positions
    [
      new Pawn(new Vector2(0, 0)),
      new Pawn(new Vector2(1, 0)),
      new Pawn(new Vector2(2, 0)),
      new Pawn(new Vector2(3, 0)),

      new Pawn(new Vector2(0, 3), PieceOwner.OPPONENT),
      new Pawn(new Vector2(1, 3), PieceOwner.OPPONENT),
      new Pawn(new Vector2(2, 3), PieceOwner.OPPONENT),
      new Pawn(new Vector2(3, 3), PieceOwner.OPPONENT),
    ].forEach(piece => {
      const tile = this.getTileAt(piece.getCoords());

      if (tile === null) {
        throw new Error(`Attempted to place "${piece.getName()}" at ${piece.getPosition().toString()} but there was no Tile`);
      }

      tile.addPiece(piece);
      piece.setId(getEntityId().toString());
      this.pieces.set(piece.getId(), piece);
    });
  }

  public getTileAt(position: Vector2): DisplayTile | null {
    const tile = this.tiles.get(position.toString());

    if (tile === undefined) {
      return null;
    }

    return tile;
  }

  public getTileAtWorldPosition(position: Vector2): DisplayTile | null {
    const tile = this.getTiles().find((tile: DisplayTile) => {
      return position.isInside(tile.getClickableRect());
    });

    if (tile === undefined) {
      return null;
    }

    return tile;
  }

  public getWorldRect(): Rect {
    const position = this.getWorldPosition();
    return new Rect(
      position.y,
      (this.width * DisplayTile.SIZE) + position.x,
      position.y + (this.height * DisplayTile.SIZE),
      position.x
    );
  }

  public getName(): string {
    return "BOARD";
  }

  public update(): void {
  }

  public draw(): void {
  }

  public debug(): void {
  }
}
