import Entity from "../Object/Entity";
import Vector2 from "../Math/Vector2";
import WillDebug from "../Object/WillDebug";
import Runtime from "../Runtime/Runtime";
import Tile from "../GameObject/Board/Tile";
import Color from "../Renderer/Color";
import GridObject from "../Object/GridObject";

export default abstract class Trigger extends GridObject implements WillDebug {
  private roomPosition: Vector2 = Vector2.zero();

  public start(): void {}
  public update(): void {}

  public setRoomPosition(position: Vector2): void {
    this.roomPosition = position;
  }

  public getRoomPosition(): Vector2 {
    return this.roomPosition;
  }

  public debug(): void {
    const ctx = Runtime.instance.getRenderingContext();
    const position = this.getWorldPosition();
    const size = 0.5;
    const offset = ((1 - size) / 2) * Tile.SIZE;

    ctx.save();

    ctx.strokeStyle = Color.GREEN.toString();
    ctx.strokeRect(
      position.x + offset,
      position.y + offset,
      Tile.SIZE * size,
      Tile.SIZE * size
    );

    ctx.restore();
  }

  public getRelativeSize(): number {
    return 1;
  }

  public abstract triggered(): void;
}
