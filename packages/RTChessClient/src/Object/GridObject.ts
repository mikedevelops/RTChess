import Entity from "./Entity";
import DisplayTile from "../GameObject/Board/DisplayTile";
import Rect from '../../../RTChessCore/src/Primitives/Rect';
import Vector2 from '../../../RTChessCore/src/Primitives/Vector2';

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
    const size = this.getRelativeSize() * DisplayTile.SIZE;
    const padding = (DisplayTile.SIZE - size) / 2;

    return new Rect(padding, size + padding, size + padding, padding);
  }
}
