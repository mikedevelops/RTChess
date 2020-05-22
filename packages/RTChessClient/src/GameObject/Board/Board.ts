import Entity from "../../Object/Entity";
import WillDraw from "../../Object/WillDraw";
import WillDebug from "../../Object/WillDebug";
import Tile from "./Tile";
import Vector2 from "../../Math/Vector2";
import { getEntityId } from "../../Runtime/EntityManager";
import Piece, { PieceOwner } from "../Piece/Piece";
import Runtime, { RuntimeFlag } from "../../Runtime/Runtime";
import { SortLayer } from "../../Renderer/Renderer";
import Pawn from "../Piece/Pawn";

export default class Board extends Entity implements WillDraw, WillDebug {
  private tiles: Map<string, Tile> = new Map();
  private pieces: Map<string, Piece> = new Map();
  private takenPieces: Map<string, Piece> = new Map();
  private width: number = 4;
  private height: number = 4;
  private activePiece: Piece | null = null;

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

  public selectTileAtWorldPosition(position: Vector2): void {
    const tile = this.getTileAtWorldPosition(position);

    if (tile === null) {
      return;
    }

    const piece = tile.getPiece();
    const canFocusPiece = piece !== null && !piece.isOpponentPiece() ||
    (piece !== null && Runtime.instance.hasFlag(RuntimeFlag.SINGLE_PLAYER) && Runtime.instance.isDebugMode());

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
      for (const move of Runtime.instance.getAvailableMoves(this.activePiece)) {
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
    Runtime.instance.createMoveTransaction(piece, tile);
  }

  public start(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const tile = new Tile(this, new Vector2(x, y));
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
