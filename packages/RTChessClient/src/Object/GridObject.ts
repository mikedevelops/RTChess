import Entity from "./Entity";
import Vector2 from "../Math/Vector2";
import Tile from "../GameObject/Board/Tile";
import Rect from "../Primitives/Rect";

export default abstract class GridObject extends Entity {
  constructor(protected coords: Vector2) {
    super();
  }

  /**
   * This is the size relative to the base Tile size
   */
  protected abstract getRelativeSize(): number;

  public getCoords(): Vector2 {
    return this.coords;
  }

  public setCoords(position: Vector2): void {
    this.coords = position;
  }

  protected getTileRect(): Rect {
    const size = this.getRelativeSize() * Tile.SIZE;
    const space = Tile.SIZE - size;
    const padding = (Tile.SIZE - size) / 2;

    return new Rect(padding, size + padding, size + padding, padding);
  }
}
