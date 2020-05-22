import Node from "../Object/Node";
import Vector2 from "../Math/Vector2";

export default abstract class Scene extends Node {
  protected position: Vector2 = Vector2.zero();

  public abstract update(): boolean;
  public abstract getName(): string;
}
