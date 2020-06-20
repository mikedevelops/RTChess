import GridObject from '../../Object/GridObject';
import ClientRuntime from '../../Runtime/ClientRuntime';
import WillDraw from '../../Object/WillDraw';
import { SortLayer } from '../../Renderer/Renderer';
import WillDebug from '../../Object/WillDebug';
import Color from '../../Renderer/Color';
import DisplayTile from '../Board/DisplayTile';
import Rect from '../../../../RTChessCore/src/Primitives/Rect';
import Vector2 from '../../../../RTChessCore/src/Primitives/Vector2';
import SerialisedPiece from '../../../../RTChessCore/src/Board/SerialisedPiece';

export enum PieceType {
  PAWN
}

export enum PieceOwner {
  PLAYER = "PLAYER",
  OPPONENT = "OPPONENT",
}

export default abstract class DisplayPiece extends GridObject implements WillDebug, WillDraw {
  private id: string = "";
  private active: boolean = false;
  private moved: boolean = false;

  constructor(coords: Vector2, protected owner: PieceOwner) {
    super(coords);
  }

  public abstract getType(): PieceType;

  public setMoved(moved: boolean): void {
    this.moved = moved;
  }

  public hasMoved(): boolean {
    return this.moved;
  }

  public isSameSet(piece: DisplayPiece): boolean {
    return piece.getOwner() === this.getOwner();
  }

  public getOwner(): PieceOwner {
    return this.owner;
  }

  public isOpponentPiece(): boolean {
    return this.owner === PieceOwner.OPPONENT;
  }

  public getId(): string {
    if (this.id  === "") {
      throw new Error("Attempted to get ID before it was set");
    }

    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public focus(): void {
    this.active = true;
  }

  public blur(): void {
    this.active = false;
  }

  public isActive(): boolean {
    return this.active;
  }

  public debug(): void {
  }

  public getSortLayer(): SortLayer {
    return SortLayer.PIECE;
  }

  public draw(): void {
    if (!this.active) {
      return;
    }

    const ctx = this.getRenderingContext();

    ctx.save();
    ctx.fillStyle = Color.RED.setAlpha(0.25).toString();

    for (const position of this.getMoves()) {
      const worldPosition = position
        .clone()
        .multiply(DisplayTile.SIZE, -DisplayTile.SIZE)
        .add(ClientRuntime.instance.getBoard().getWorldPosition());

      ctx.fillRect(worldPosition.x, worldPosition.y, DisplayTile.SIZE, DisplayTile.SIZE);
    }

    ctx.restore();
  }

  public getMoves(): Vector2[] {
    return ClientRuntime.instance.getAvailableMoves(this);
  }

  public getWorldRect(): Rect {
    const position = this.getWorldPosition();
    return new Rect(
      position.y, position.x + DisplayTile.SIZE, position.y + DisplayTile.SIZE, position.x
    );
  }

  public serialise(): SerialisedPiece {
    return {
      position: this.position.serialise(),
      id: this.getId(),
    }
  }
}

