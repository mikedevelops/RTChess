import DisplayPiece, { PieceType, PieceOwner } from "./DisplayPiece";
import ClientRuntime from "../../Runtime/ClientRuntime";
import Color from "../../Renderer/Color";
import Vector2 from '../../../../RTChessCore/src/Primitives/Vector2';

export default class Pawn extends DisplayPiece {
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
    const ctx = ClientRuntime.instance.renderer.getContext();
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
