import WillDebug from '../../Object/WillDebug';
import WillDraw from '../../Object/WillDraw';
import ClientRuntime from '../../Runtime/ClientRuntime';
import { SortLayer } from '../../Renderer/Renderer';
import Color from '../../Renderer/Color';
import Unit from '../../Math/Unit';
import Text from '../../Renderer/Text';
import Entity from '../../Object/Entity';
import Piece from '../Piece/Piece';
import Rect from '../../../../RTChessCore/src/Primitives/Rect';
import Vector2 from '../../../../RTChessCore/src/Primitives/Vector2';

const NAME = "TILE";

/**
 * The Tile _could_ be a GridObject! However, I'm choosing not right now
 * because there are a few things in GridObject that are relative to a
 * Tile. It feels weird at the minute to be implementing things (like
 * getRelativeSize() for example) that are relative to itself...
 */

export default class Tile extends Entity implements WillDebug, WillDraw {
  public static SIZE: number = Unit.getUnit(2);

  private piece: Piece | null = null;

  constructor(private coords: Vector2) {
    super();
  }

  public getSortLayer(): SortLayer {
    return SortLayer.TILE;
  }

  public hasPiece(): boolean {
    return this.piece !== null;
  }

  public hasOpponentPiece(): boolean {
    return this.piece !== null && this.piece.isOpponentPiece();
  }

  public getId(): string {
    return this.coords.toString();
  }

  public draw(): void {
    const ctx = ClientRuntime.instance.renderer.getContext();
    const position = this.getWorldPosition();

    ctx.save();
    ctx.fillStyle = (this.coords.x + this.coords.y) % 2 === 0 ?
      Color.BLUE.toString() :
      Color.GREEN.toString();
    ctx.fillRect(position.x, position.y, Tile.SIZE, Tile.SIZE);
    ctx.restore();
  }

  public getPiece(): Piece | null {
    return this.piece;
  }

  public removePiece(piece: Piece): void {
    this.piece = null;
    this.removeChild(piece);
  }

  public addPiece(piece: Piece): Piece | null {
    const oldPiece = this.piece;

    if (oldPiece !== null) {
      this.removeChild(oldPiece);
    }

    this.addChild(piece);
    piece.setCoords(this.getCoords());
    this.piece = piece;

    return oldPiece;
  }

  public getName(): string {
    return NAME;
  }

  public getCoords(): Vector2 {
    return this.coords;
  }

  public getWorldPosition(): Vector2 {
    return super
      .getWorldPosition()
      .clone()
      .add(this.coords.clone().multiply(Tile.SIZE, -Tile.SIZE));
  }

  public start(): void {}
  public update(): void {}

  public debug(): void {
    const ctx = ClientRuntime.instance.renderer.getContext();
    const position = this.getWorldPosition();

    ctx.save();
    ctx.fillStyle = Color.DEBUG.toString();
    ctx.strokeStyle = Color.DEBUG.toString();
    ctx.fillText(
      this.coords.toString(),
      position.x,
      position.y + Text.FONT_SIZE
    );
    ctx.strokeRect(position.x, position.y, Tile.SIZE, Tile.SIZE);

    // Clickable
    const clickableRect = this.getClickableRect();
    ctx.fillStyle = Color.RED.setAlpha(0.25).toString();
    ctx.fillRect(clickableRect.left, clickableRect.top, clickableRect.getWidth(), clickableRect.getHeight());
    ctx.restore();
  }

  public getClickableRect(): Rect {
    const position = this.getWorldPosition();

    return new Rect(
      position.y,
      position.x + Tile.SIZE,
      position.y + Tile.SIZE,
      position.x
    );
  }

  public getWorldRect(): Rect {
    const position = this.getWorldPosition();
    return new Rect(
      position.y, position.x + Tile.SIZE, position.y + Tile.SIZE, position.x
    );
  }
}
