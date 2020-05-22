import Text from "./Text";
import Color from "./Color";
import WillDraw from "../Object/WillDraw";
import WillDebug, { instanceofWillDebug } from "../Object/WillDebug";
import Unit from "../Math/Unit";
import Runtime, { RuntimeMode } from "../Runtime/Runtime";

// TODO: Implement a fixed/adaptive resolution to support different
// window sizes

export enum SortLayer {
  BOARD,
  TILE,
  PIECE,
  UI,
}

export default class Renderer {
  public ctx: CanvasRenderingContext2D;

  private layers: WillDraw[][] = [];

  constructor(canvas: HTMLCanvasElement, public dpr: number) {
    const ctx = canvas.getContext("2d");

    if (ctx === null) throw new Error("Canvas Context not supported!");

    this.ctx = ctx;
  }

  public start() {
    this.ctx.scale(this.dpr, this.dpr);
  }

  public draw(entities: WillDraw[]): void {
    /**
     * Sort layers
     */
    for (const entity of entities) {
      if (this.layers[entity.getSortLayer()] === undefined) {
        this.layers[entity.getSortLayer()] = [];
      }

      this.layers[entity.getSortLayer()].push(entity);
    }

    for (const layer of this.layers) {
      for (const entity of layer) {
        this.ctx.save();
        entity.draw();
        this.ctx.restore();

        /**
         * Draw Debug things
         */
        if (
          Runtime.instance.getMode() !== RuntimeMode.PRODUCTION &&
          instanceofWillDebug(entity)
        ) {
          this.ctx.save();
          this.ctx.font = Text.getFont(Unit.getUnit(0.5));
          this.ctx.fillStyle = Color.DEBUG.toString();
          (entity as WillDebug).debug();
          this.ctx.restore();
        }

        // Empty srorting layer
        this.layers[this.layers.indexOf(layer)] = [];
      }
    }
  }

  public getWidth(): number {
    return this.ctx.canvas.width / this.dpr;
  }

  public clear() {
    const { width, height } = this.ctx.canvas;

    this.ctx.save();

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = Color.BLACK.toString();
    this.ctx.font = Text.getFont();
    this.ctx.fillRect(0, 0, width, height);

    this.ctx.restore();
  }
}
