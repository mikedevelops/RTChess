import Text from '../Renderer/Text';
import ClientRuntime from '../Runtime/ClientRuntime';
import Unit from '../Math/Unit';
import Time from '../Time/Time';
import Color from '../Renderer/Color';
import Entity from '../Object/Entity';
import Node from '../Object/Node';
import { InputEvent } from '../Input/InputDelegator';
import DisplayTile from '../GameObject/Board/DisplayTile';
import DebugInputManager from '../Input/DebugInputManager';
import ClientPlayer from '../Lobby/ClientPlayer';
import Vector2 from '../../../RTChessCore/src/Primitives/Vector2';
import { SerialisedTransaction, TransactionState } from '../../../RTChessCore/src/Transaction/Transaction';
import { Log } from '../../../RTChessLog/src/Log/Logger';
import { clamp } from '../../../RTChessCore/src/Math/Math';

export enum DebugFlag {
  FRAMES,
  ENTITY_COUNT,
  ENTITIES,
  EVENTS,
  TRANSACTIONS,
  NETWORK,
  CLIENT_LOGS
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

  constructor(
    private flags: DebugFlag[] = []
  ) {}

  public toggleEnabled(): void {
    this.enabled = !this.enabled;
  }

  public getWorldPosition(): Vector2 {
    return Vector2.unit(1, 1, Unit.getUnit(1));
  }

  public start(): void {
    ClientRuntime.instance.input.register(new DebugInputManager());
  }

  public update(): void {
    this.sampleFps();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }


  public draw(): void {
    if (!this.enabled) {
      return;
    }

    const ctx = ClientRuntime.instance.renderer.getContext();
    const position = this.getWorldPosition();
    const padding = new Vector2(Unit.getUnit(0.5), Unit.getUnit(1));
    const fontSize = Unit.getUnit(0.4);
    const newline = fontSize;
    const scene = ClientRuntime.instance.getScene();
    let lineOffsetY = position.y + padding.y;
    let lineOffsetX = position.x + padding.x;

    ctx.fillStyle = Color.YELLOW.toString();
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 1;
    ctx.shadowColor = Color.BLACK.toString();
    ctx.font = Text.getFont(fontSize);

    /**
     * Lobby
     */
    if (this.hasFlag(DebugFlag.NETWORK)) {
      const lobby = ClientRuntime.instance.lobby;

      ctx.fillText("SOCKET", lineOffsetX, lineOffsetY += newline);
      ctx.fillText(ClientRuntime.instance.getSocket().id, lineOffsetX, lineOffsetY += newline);

      lineOffsetY += newline;

      ctx.fillText("PLAYER", lineOffsetX, lineOffsetY += newline);
      ctx.fillText(
        ClientRuntime.instance.getPlayer() === null ?
          "NULL" :
          (ClientRuntime.instance.getPlayer() as ClientPlayer).getId(),
        lineOffsetX,
        lineOffsetY += newline
      );

      lineOffsetY += newline;

      ctx.fillText("LOBBY", lineOffsetX, lineOffsetY += newline);

      for (const player of lobby.getPlayers()) {
        ctx.fillText(player.getId(), lineOffsetX, lineOffsetY += newline);
      }

      lineOffsetY += newline;

      ctx.fillText("MATCHES", lineOffsetX, lineOffsetY += newline);

      for (const match of lobby.getMatches()) {
        ctx.fillText(`${match.getId()}`, lineOffsetX, lineOffsetY += newline);
      }
    }

    /**
     * Frames
     */
    if (this.hasFlag(DebugFlag.FRAMES)) {
      const fps = `FPS: ${Math.round(1000 / this.fps)}`;
      ctx.fillText(fps, lineOffsetX, lineOffsetY += newline * 2);
      ctx.fillText(
        ` | FRAME: ${ClientRuntime.instance.getFrame()}`,
        lineOffsetX + Text.getWidth(fps, ctx.font),
        lineOffsetY
      );
    }

    /**
     * Entities
     */
    if (this.hasFlag(DebugFlag.ENTITY_COUNT)) {
      const entities = ClientRuntime.instance.getOnScreenEntities();

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
    if (this.hasFlag(DebugFlag.ENTITIES)) {
      lineOffsetY += newline;

      ctx.fillText(scene.getName(), lineOffsetX, (lineOffsetY += newline));
      scene.forEachChildRecursive((entity: Node) => {
        if (!(entity instanceof Entity)) {
          return;
        }

        let label = entity.getName();

        if (entity instanceof DisplayTile) {
          label += ` ${(entity as DisplayTile).getCoords().toString()}`;
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
      const events = ClientRuntime.instance.getEventHistory();

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
      const transactions = ClientRuntime.instance.getTransactions();
      const max = 10;

      ctx.fillText("TRANSACTIONS", lineOffsetX, (lineOffsetY += newline * 2));
      transactions
        .slice(clamp(transactions.length - max))
        .reverse()
        .forEach((transaction: SerialisedTransaction, index: number) => {
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
            `PLAYER ${transaction.player.id} ` +
            `${transaction.type} ` +
            `${transaction.state} ` +
            (!transaction.resolvedAt ?
              "" :
              ` ${transaction.resolvedAt - transaction.createdAt}ms`),
            lineOffsetX,
            (lineOffsetY += newline * 2)
          );
        });
    }

    /**
     * Client logs
     */
    if (this.hasFlag(DebugFlag.CLIENT_LOGS)) {
      // const logs = ClientRuntime.instance.logger.getHistory();
      // TODO: think about local client logs. Should we have the client debugger show client logs? Or all logs maybe?:w
      const logs: Log[] = [];

      ctx.fillText("CLIENT LOGS", lineOffsetX, lineOffsetY += newline * 2);

      lineOffsetY += newline;

      for (const log of logs) {
        ctx.fillText(log.format(), lineOffsetX, lineOffsetY += newline);
      }
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
