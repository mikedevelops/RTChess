import Renderer from "../Renderer/Renderer";
import InputDelegator from "../Input/InputDelegator";
import SceneManager from "../Scene/SceneManager";
import Debugger from "../Debugger/Debugger";
import Time from "../Time/Time";
import Scene from "../Scene/Scene";
import Vector2 from "../Math/Vector2";
import Entity from "../Object/Entity";
import AbstractInputManager from "../Input/AbstractInputManager";
import { InputEvent } from "../Input/InputDelegator";
import Board from "../GameObject/Board/Board";
import Piece from "../GameObject/Piece/Piece";
import MoveResolver from "./MoveResolver";
import TransactionManager from "../Transaction/TransactionManager";
import Tile from "../GameObject/Board/Tile";
import MoveTransaction, { SerialisedMoveTransaction } from '../Transaction/MoveTransaction';
import { SerialisedTransaction } from '../Transaction/Transaction';

export enum RuntimeMode {
  STEPPED,
  DEBUG,
  PRODUCTION,
}

export enum RuntimeFlag {
  CONTROL_PLAYER,
  SINGLE_PLAYER,
  MULTI_PLAYER
}

export default class Runtime {
  private frame: number = 0;
  private lastFrameTime: number = 0;
  private updateWithContext: (this: Runtime) => void;
  private transactionManager: TransactionManager = new TransactionManager();

  public static instance: Runtime;

  // TODO: Why are these injected? Do they really need to be?
  constructor(
    private renderer: Renderer,
    private input: InputDelegator,
    private sceneManager: SceneManager,
    private debug: Debugger,
    private moveResolver: MoveResolver,
    private mode: RuntimeMode = RuntimeMode.PRODUCTION,
    private flags: RuntimeFlag[] = []
  ) {
    if (Runtime.instance !== undefined) {
      throw new Error("Attempted to create another Runtime");
    }

    Runtime.instance = this;
    this.updateWithContext = this.update.bind(this);
  }

  public isDebugMode(): boolean {
    return this.mode === RuntimeMode.DEBUG;
  }

  public getEventHistory(): InputEvent[] {
    return this.input.getHistory();
  }

  public registerInputManager(manager: AbstractInputManager): void {
    this.input.register(manager);
  }

  public isProduction(): boolean {
    return this.mode === RuntimeMode.PRODUCTION;
  }

  public getMode(): RuntimeMode {
    return this.mode;
  }

  public setMode(mode: RuntimeMode): void {
    if (mode === RuntimeMode.STEPPED) {
      this.enableSteppedMode();

      return;
    }

    this.mode = mode;
  }

  private enableSteppedMode(): void {
    this.mode = RuntimeMode.STEPPED;
    document.addEventListener("keypress", (event) => {
      if (!event.shiftKey) {
        return;
      }

      if (event.key === "L") {
        this.nextFrame();
      }
    });
  }

  public start() {
    if (this.mode === RuntimeMode.STEPPED) {
      this.enableSteppedMode();
    }

    /**
     * Start Input Manager
     */
    this.input.listen();

    /**
     * Start Renderer
     */
    this.renderer.start();

    /**
     * Start Scene Manager
     */
    this.sceneManager.start();

    /**
     * Start Debugger
     */
    if (this.mode !== RuntimeMode.PRODUCTION) {
      this.debug.start();
    }

    /**
     * Start Update
     */
    this.lastFrameTime = Date.now();
    this.update();
  }

  private update() {
    const now = Date.now();

    /**
     * Update frame delta
     */
    Time.delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    /**
     * Update Input Manager
     */
    this.input.update();

    /**
     * Update Transactions
     */
    this.transactionManager.update();

    /**
     * Update Scene Manager
     */
    this.sceneManager.update();

    /**
     * Update debugger
     */
    if (this.mode !== RuntimeMode.PRODUCTION) {
      this.debug.update();
    }

    /**
     * Clear Renderer
     */
    this.renderer.clear();

    /**
     * Draw Scene
     */
    this.renderer.draw(this.sceneManager.getDrawableEntities());

    /**
     * Draw Debugger
     */
    if (this.mode !== RuntimeMode.PRODUCTION) {
      this.debug.draw();
    }

    this.frame++;

    if (this.mode !== RuntimeMode.STEPPED) {
      requestAnimationFrame(this.updateWithContext);
    }
  }

  public nextFrame(): void {
    if (this.mode !== RuntimeMode.STEPPED) {
      return;
    }

    /**
     * Provide a real-ish frame delta
     */
    this.lastFrameTime = Date.now() - 16;
    this.update();
  }

  public getFrame(): number {
    return this.frame;
  }

  public getRenderingContext(): CanvasRenderingContext2D {
    return this.renderer.ctx;
  }

  public getScene(): Scene {
    return this.sceneManager.getScene();
  }

  public getOnScreenEntities(): Entity[] {
    return this.sceneManager.getOnScreenEntities();
  }

  public hasFlag(flag: RuntimeFlag): boolean {
    return this.flags.find((f) => f === flag) !== undefined;
  }

  public getMoveTransactions(): SerialisedMoveTransaction[] {
    return this.transactionManager.getMoveTransactions();
  }

  public createMoveTransaction(
    piece: Piece,
    target: Tile,
  ): MoveTransaction {
    return this.transactionManager.createMoveTransaction(
      this.getBoard(),
      piece,
      target
    );
  }

  public toggleDebugger(): void {
    this.debug.toggleEnabled();
  }

  public getBoard(): Board {
    const scene = this.getScene();

    if (scene.getName() === "S_SANDBOX") {
      return (scene as any).getBoard() as Board;
    }

    throw new Error("Cannot get board!");
  }

  public getAvailableMoves(piece: Piece): Vector2[] {
    return this.moveResolver.getAvailableMoves(piece);
  }
}
