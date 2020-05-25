import Text from "./Text";
import Color from "./Color";
import WillDraw from "../Object/WillDraw";
import WillDebug, { instanceofWillDebug } from "../Object/WillDebug";
import Unit from "../Math/Unit";
import ClientRuntime, { RuntimeMode } from "../Runtime/ClientRuntime";

// TODO: Implement a fixed/adaptive resolution to support different
// window sizes

// TODO: These need to be int in draw order!
export enum SortLayer {
  BOARD= 0,
  TILE= 1,
  PIECE= 2,
  UI = 3,
}

export default class Renderer {
  private ctx: CanvasRenderingContext2D;
  private layers: Map<SortLayer, WillDraw[]> = new Map();

  constructor(canvas: HTMLCanvasElement, public dpr: number) {
    const ctx = canvas.getContext("2d");

    if (ctx === null) throw new Error("Canvas Context not supported!");

    this.ctx = ctx;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public start() {
    this.ctx.scale(this.dpr, this.dpr);
  }

  public draw(entities: WillDraw[]): void {
    /**
     * Sort layers
     */
    for (const entity of entities) {
      const sort = entity.getSortLayer();

      if (!this.layers.has(sort)) {
        this.layers.set(sort, [entity]);
        continue;
      }

      const drawables = this.layers.get(sort) as WillDraw[];

      drawables.push(entity);
    }

    // For each sorting layer in order (lowest first!)
    for (const layer of [...this.layers.keys()].sort()) {
      const drawables = this.layers.get(layer) as WillDraw[];

      for (const entity of drawables) {
        this.ctx.save();
        this.ctx.font = Text.getFont();
        entity.draw();
        this.ctx.restore();

        /**
         * Draw Debug things
         */
        if (
          ClientRuntime.instance.debug.isEnabled() &&
          instanceofWillDebug(entity)
        ) {
          this.ctx.save();
          this.ctx.font = Text.getFont(Unit.getUnit(0.5));
          this.ctx.fillStyle = Color.DEBUG.toString();
          this.ctx.strokeStyle = Color.DEBUG.toString();
          (entity as WillDebug).debug();
          this.ctx.restore();
        }

      }
    }

    // TODO: Look at some sort of caching here if we get that desperate for ms
    this.layers.clear();
  }

  public getWidth(): number {
    return this.ctx.canvas.width / this.dpr;
  }

  public getHeight(): number {
    return this.ctx.canvas.height / this.dpr;
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
