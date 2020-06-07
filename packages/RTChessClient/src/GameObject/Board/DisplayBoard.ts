import Entity from "../../Object/Entity";
import WillDraw from "../../Object/WillDraw";
import WillDebug from "../../Object/WillDebug";
import Tile from "./Tile";
import Piece from "../Piece/Piece";
import ClientRuntime, { RuntimeFlag } from "../../Runtime/ClientRuntime";
import { SortLayer } from "../../Renderer/Renderer";
import Rect from '../../../../RTChessCore/src/Primitives/Rect';
import Vector2 from '../../../../RTChessCore/src/Primitives/Vector2';

export default class DisplayBoard extends Entity implements WillDraw, WillDebug {
  private tiles: Map<string, Tile> = new Map();
  private pieces: Map<string, Piece> = new Map();
  private width: number = 4;
  private height: number = 4;
  private activePiece: Piece | null = null;

  public setState(data: { [index: number]: number }): void {
  }

  public start(): void {
  }

  public getSortLayer(): SortLayer {
    return SortLayer.BOARD;
  }

  public getPieces(): Piece[] {
    return [...this.pieces.values()];
  }

  public getTiles(): Tile[] {
    return [...this.tiles.values()];
  }

  public getPieceAtPosition(position: Vector2): Piece | null {
    for (const tile of this.getTiles()) {
      if (position.isInside(tile.getClickableRect())) {
        return tile.getPiece();
      }
    }

    return null;
  }

  public getWorldPosition(): Vector2 {
    return super.getWorldPosition().add(Vector2.unit(0, this.height -1, Tile.SIZE));
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
          (piece as Piece).focus();
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
        (piece as Piece).focus();
      }
    }
  }

  public movePiece(piece: Piece, tile: Tile): void {
    //ClientRuntime.instance.createMoveTransaction(piece, tile);
  }

  public getTileAt(position: Vector2): Tile | null {
    const tile = this.tiles.get(position.toString());

    if (tile === undefined) {
      return null;
    }

    return tile;
  }

  public getTileAtWorldPosition(position: Vector2): Tile | null {
    const tile = this.getTiles().find((tile: Tile) => {
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
      (this.width * Tile.SIZE) + position.x,
      position.y + (this.height * Tile.SIZE),
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
