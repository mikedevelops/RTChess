import Text from "../Renderer/Text";
import Vector2 from "../Math/Vector2";
import Runtime from "../Runtime/Runtime";
import Unit from "../Math/Unit";
import Time from "../Time/Time";
import Color from "../Renderer/Color";
import Entity from "../Object/Entity";
import Node from "../Object/Node";
import { InputEvent } from "../Input/InputDelegator";
import Tile from "../GameObject/Board/Tile";
import MathUtils from "../Math/MathUtils";
import MoveTransaction, { SerialisedMoveTransaction } from '../Transaction/MoveTransaction';
import { TransactionState } from '../Transaction/Transaction';

export enum DebugFlag {
  FRAMES,
  ENTITY_COUNT,
  ENTITY_TREE,
  EVENTS,
  TRANSACTIONS,
}

/**
 * The Debugger is a one-off entity, therefore to avoid confusion
 * we are not going to render it using the scene manager. We'll treat
 * it as a seperate entitiy that we draw manually.
 */
export default class Debugger {
  private fpsSample: number[] = [];
  private fps: number = 0;
  private enabled: boolean = true;

  constructor(private flags: DebugFlag[] = []) {}

  public toggleEnabled(): void {
    this.enabled = !this.enabled;
  }

  public getWorldPosition(): Vector2 {
    return Vector2.unit(1, 1);
  }

  public start(): void {}

  public update(): void {
    this.sampleFps();
  }

  public draw(): void {
    if (!this.enabled) {
      return;
    }

    const ctx = Runtime.instance.getRenderingContext();
    const position = this.getWorldPosition();
    const padding = new Vector2(Unit.getUnit(0.5), Unit.getUnit(1));
    const fontSize = Unit.getUnit(0.4);
    const newline = fontSize;
    const scene = Runtime.instance.getScene();
    let lineOffsetY = position.y + padding.y;
    let lineOffsetX = position.x + padding.x;

    ctx.fillStyle = Color.DEBUG.toString();
    ctx.font = Text.getFont(fontSize);

    /**
     * Frames
     */
    if (this.hasFlag(DebugFlag.FRAMES)) {
      const fps = `FPS: ${Math.round(1000 / this.fps)}`;
      ctx.fillText(fps, lineOffsetX, lineOffsetY);
      ctx.fillText(
        ` | FRAME: ${Runtime.instance.getFrame()}`,
        lineOffsetX + Text.getWidth(fps, ctx.font),
        lineOffsetY
      );
    }

    /**
     * Entities
     */
    if (this.hasFlag(DebugFlag.ENTITY_COUNT)) {
      const entities = Runtime.instance.getOnScreenEntities();

      /**
       * Entity Count
       */
      ctx.fillText(
        `ONSCREEN ENTITIES ${entities.length}`,
        lineOffsetX,
        (lineOffsetY += newline)
      );
    }

    /**
     * Entity Node
     */
    if (this.hasFlag(DebugFlag.ENTITY_TREE)) {
      lineOffsetY += newline;

      ctx.fillText(scene.getName(), lineOffsetX, (lineOffsetY += newline));
      scene.forEachChildRecursive((entity: Node) => {
        if (!(entity instanceof Entity)) {
          return;
        }

        let label = entity.getName();

        if (entity instanceof Tile) {
          label += ` ${(entity as Tile).getCoords().toString()}`;
        }

        ctx.fillText(
          label,
          lineOffsetX + this.getEntityDepth(entity, 1) * Unit.getUnit(0.5),
          (lineOffsetY += newline)
        );
      });
    }

    /**
     * Events
     */
    if (this.hasFlag(DebugFlag.EVENTS)) {
      const events = Runtime.instance.getEventHistory();

      ctx.fillText("EVENTS", lineOffsetX, (lineOffsetY += newline * 2));

      events.forEach((event: InputEvent) => {
        ctx.fillText(
          `${event.time} [${event.type}] ${event.target} [${event.handler.join(
            ","
          )}]`,
          lineOffsetX,
          (lineOffsetY += newline)
        );
      });
    }

    /**
     * Transactions
     */
    if (this.hasFlag(DebugFlag.TRANSACTIONS)) {
      const transactions = Runtime.instance.getMoveTransactions();
      const max = 10;

      ctx.fillText("TRANSACTIONS", lineOffsetX, (lineOffsetY += newline * 2));
      transactions
        .slice(MathUtils.clamp(transactions.length - max))
        .reverse()
        .forEach((transaction: SerialisedMoveTransaction, index: number) => {
          switch (transaction.state) {
            case TransactionState.PENDING:
              ctx.fillStyle = Color.YELLOW.toString();
              break;
            case TransactionState.COMPLETE:
              ctx.fillStyle = Color.GREEN.toString();
              break;
            case TransactionState.REJECTED:
              ctx.fillStyle = Color.RED.toString();
              break;
            default:
              ctx.fillStyle = Color.DEBUG.toString();
              break;
          }


          ctx.fillText(
            `[${transaction.createdAt.toString()}] ` +
              `${transaction.type} ` +
            `(${transaction.piece} ${transaction.from}) ` +
            `-> ${transaction.to}` +
            (transaction.resolvedAt === null ?
              "" :
              ` ${transaction.resolvedAt - transaction.createdAt}ms`),
            lineOffsetX,
            (lineOffsetY += newline)
          );
        });
    }

    // TODO: Toggle Debugger on "`"
    // TODO: implement some sort of selection for the hierarchy!
    // highlight line by line with expand and collapse!
  }

  private getEntityDepth(entity: Entity, count = 0): number {
    const parent = entity.getParent();

    if (parent === null) {
      return count;
    }

    return this.getEntityDepth(parent, count + 1);
  }

  private sampleFps(): void {
    if (this.fpsSample.length < 30) {
      this.fpsSample.push(Time.delta);
    } else {
      this.fps =
        this.fpsSample.reduce((sum, sample) => {
          return sum + sample;
        }, 0) / this.fpsSample.length;
      this.fpsSample = [];
    }
  }

  private hasFlag(flag: DebugFlag): boolean {
    return this.flags.find((f) => f === flag) !== undefined;
  }
}
