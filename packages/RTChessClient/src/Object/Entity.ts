import Node from "./Node";
import ClientRuntime from "../Runtime/ClientRuntime";
import WillDebug from './WillDebug';
import Unit from '../Math/Unit';
import Rect from '../../../RTChessCore/src/Primitives/Rect';
import Vector2 from '../../../RTChessCore/src/Primitives/Vector2';

export default abstract class Entity extends Node implements WillDebug {
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

  public center(): void {
    if (this.parent === null) {
      const { renderer } = ClientRuntime.instance;
      this.centerPosition(new Rect(0, renderer.getWidth(), renderer.getHeight(), 0));

      return;
    }

    this.centerPosition(this.parent.getWorldRect());
  }

  private centerPosition(parentRect: Rect): void {
    const rect = this.getWorldRect();

    this.setPosition(new Vector2(
      (parentRect.getWidth() / 2) - (rect.getWidth() / 2),
      (parentRect.getHeight() / 2) - (rect.getHeight() / 2),
    ));
  }

  public abstract getWorldRect(): Rect;

  protected getRenderingContext(): CanvasRenderingContext2D {
    return ClientRuntime.instance.renderer.getContext();
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

  public debug(): void {
    const ctx = ClientRuntime.instance.renderer.getContext();
    const rect = this.getWorldRect();
    const position = this.getWorldPosition();

    ctx.beginPath();
    ctx.moveTo(rect.left, rect.top);
    ctx.lineTo(rect.right, rect.top);
    ctx.lineTo(rect.right, rect.bottom);
    ctx.lineTo(rect.left, rect.bottom);
    ctx.stroke();

    ctx.fillText(`WP ${position.x}x${position.y}`, rect.left, rect.top + Unit.getUnit(0.5));
    ctx.fillText(`NW ${rect.left}x${rect.top}`, rect.left, rect.top);
    ctx.fillText(`NE ${rect.right}x${rect.top}`, rect.right, rect.top);
    ctx.fillText(`SE ${rect.right}x${rect.bottom}`, rect.right, rect.bottom);
    ctx.fillText(`SW l${rect.left}x${rect.bottom}`, rect.left, rect.bottom);
  }
}
