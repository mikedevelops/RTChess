import Vector2 from "../../Math/Vector2";
import Piece, { PieceType, PieceOwner } from "./Piece";
import Runtime from "../../Runtime/Runtime";
import Color from "../../Renderer/Color";

export default class Pawn extends Piece {
  constructor(coords: Vector2, owner: PieceOwner = PieceOwner.PLAYER) {
    super(coords, owner);
  }

  public getType(): PieceType {
    return PieceType.PAWN;
  }

  public start(): void {}
  public update(): void {}

  public getName(): string {
    return `PAWN (${this.owner})`;
  }

  public draw(): void {
    const ctx = Runtime.instance.getRenderingContext();
    const position = this.getWorldPosition();
    const rect = this.getTileRect();

    ctx.save();
    ctx.fillStyle = this.isOpponentPiece() ?
      Color.BLACK.toString() :
      Color.WHITE.toString();
    ctx.fillRect(position.x + rect.left, position.y + rect.top, rect.getWidth(), rect.getHeight());
    super.draw();
    ctx.restore();
  }

  public getRelativeSize(): number {
    return 0.5;
  }
}
