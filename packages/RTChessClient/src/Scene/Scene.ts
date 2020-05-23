import Node from "../Object/Node";
import { Vector2 } from "rtchess-core";

export default abstract class Scene extends Node {
  protected position: Vector2 = Vector2.zero();

  public abstract update(): boolean;
  public abstract getName(): string;
}
