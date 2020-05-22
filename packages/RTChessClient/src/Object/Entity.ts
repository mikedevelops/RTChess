import Vector2 from "../Math/Vector2";
import Node from "./Node";
import Runtime from "../Runtime/Runtime";

export default abstract class Entity extends Node {
  protected enabled: boolean = true;
  protected parent: Entity | null = null;
  protected initialised: boolean = false;
  protected position: Vector2 = Vector2.zero();

  public getWorldPosition(): Vector2 {
    const position = new Vector2();

    if (this.parent !== null) {
      position.add(this.parent.getWorldPosition());
    }

    return position.add(this.position);
  }

  protected getRenderingContext(): CanvasRenderingContext2D {
    return Runtime.instance.getRenderingContext();
  }

  public setPosition(position: Vector2): void {
    this.position.set(position);
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setParent(parent: Entity): void {
    this.parent = parent;
  }

  public getParent(): Entity | null {
    return this.parent;
  }

  public addChild(child: Entity): void {
    child.setParent(this);

    super.addChild(child);
  }

  public startUpdate(): void {
    if (!this.initialised) {
      this.initialised = true;
      this.start();
    }

    this.update();
  }

  public abstract getName(): string;
  public abstract update(): void;
  public abstract start(): void;
}
