import Entity from '../../Object/Entity';
import WillDraw from '../../Object/WillDraw';
import { SortLayer } from '../../Renderer/Renderer';
import ClientRuntime from '../../Runtime/ClientRuntime';
import Unit from '../../Math/Unit';
import Text from "../../Renderer/Text";
import Color from '../../Renderer/Color';
import Rect from '../../../../RTChessCore/src/Primitives/Rect';
import Vector2 from '../../../../RTChessCore/src/Primitives/Vector2';

export default abstract class DisplayList<T> extends Entity implements WillDraw {
  private readonly padding: Vector2 = Vector2.unit(0.5, 1, Unit.getUnit(1));

  constructor(private title: string) {
    super();
  }

  protected abstract getItems(): T[];

  public getName(): string {
    return 'LIST';
  }

  public start(): void {}
  public update(): void {}

  public draw(): void {
    const ctx = ClientRuntime.instance.renderer.getContext();
    const newline = Text.LINE_HEIGHT;
    const position = this.getWorldPosition();
    const rect = this.getWorldRect();
    let offsetY = position.y + this.padding.y;
    let offsetX = position.x + this.padding.x;

    ctx.fillStyle = Color.WHITE.toString();
    ctx.strokeStyle = Color.WHITE.toString();
    ctx.strokeRect(rect.left, rect.top, rect.getWidth(), rect.getHeight());
    ctx.fillText(this.title, offsetX, offsetY);
    ctx.beginPath();
    ctx.moveTo(rect.left, offsetY += this.padding.y / 2);
    ctx.lineTo(rect.right, offsetY);
    ctx.stroke();

    offsetY += newline;

    for (const item of this.getItems()) {
      offsetY += newline;
      this.drawItem(ctx, item, new Vector2(offsetX, offsetY));
    }
  }

  protected abstract drawItem(ctx: CanvasRenderingContext2D, item: T, position: Vector2): void;

  public getSortLayer(): SortLayer {
    return SortLayer.UI;
  }

  public getWorldRect(): Rect {
    const position = this.getWorldPosition();
    const width = Unit.getUnit(15);
    const height = (Text.LINE_HEIGHT * this.getItems().length) + Text.LINE_HEIGHT;

    return new Rect(
      position.y,
      position.x + width,
      position.y + height + (this.padding.y * 2),
      position.x
    );
  }
}
