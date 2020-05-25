import Renderer from '../Renderer/Renderer';
import InputDelegator, { InputEvent } from '../Input/InputDelegator';
import SceneManager from '../Scene/SceneManager';
import Debugger from '../Debugger/Debugger';
import Time from '../Time/Time';
import Scene from '../Scene/Scene';
import { PlayerState, SerialisedPlayer, Events, Logger, Runtime, SerialisedLobby, SerialisedTransaction, TransactionType, Vector2 } from 'rtchess-core';
import Entity from '../Object/Entity';
import AbstractInputManager from '../Input/AbstractInputManager';
import DisplayBoard from '../GameObject/Board/DisplayBoard';
import Piece from '../GameObject/Piece/Piece';
import MoveResolver from './MoveResolver';
import TransactionManager from '../Transaction/TransactionManager';
import Tile from '../GameObject/Board/Tile';
import MoveTransaction from '../Transaction/MoveTransaction';
import Transaction from '../Transaction/Transaction';
import io from 'socket.io-client';
import ClientPlayer from '../Lobby/ClientPlayer';
import LobbyScene from '../Scene/LobbyScene';
import ClientLobby from '../Lobby/ClientLobby';
import Socket = SocketIOClient.Socket;

export enum RuntimeMode {
  STEPPED = "STEPPED",
  DEBUG = "DEBUG",
  PRODUCTION = "PRODUCTION",
}

export enum RuntimeFlag {
  CONTROL_PLAYER= "CONTROL_PLAYER",
  SINGLE_PLAYER = "SINGLE_PLAYER",
  MULTI_PLAYER = "MULTI_PLAYER",
}

export default class ClientRuntime extends Runtime {
  private frame: number = 0;
  private lastFrameTime: number = 0;
  private player: ClientPlayer | null = null;
  private readonly updateWithContext: (this: ClientRuntime) => void;

  public renderer: Renderer;
  public input: InputDelegator;
  public sceneManager: SceneManager;
  public moveResolver: MoveResolver;
  public transactionManager: TransactionManager;
  public socket: Socket | null = null;
  public lobby: ClientLobby;
  public logger: Logger;

  // Singleton
  public static instance: ClientRuntime;

  constructor(
    canvas: HTMLCanvasElement,
    devicePixelRatio: number,
    public debug: Debugger,
    private mode: RuntimeMode = RuntimeMode.PRODUCTION,
    private flags: RuntimeFlag[] = []
  ) {
    super();

    if (ClientRuntime.instance !== undefined) {
      throw new Error("Attempted to create another " + this.constructor.name);
    }

    ClientRuntime.instance = this;

    this.renderer = new Renderer(canvas, devicePixelRatio);
    this.input = new InputDelegator();
    this.sceneManager = new SceneManager([new LobbyScene()]);
    this.moveResolver = new MoveResolver();
    this.transactionManager = new TransactionManager();
    this.lobby = new ClientLobby();
    this.logger = new Logger();

    this.updateWithContext = this.update.bind(this);
  }

  public getLogger(): Logger {
    return this.logger;
  }

  public connect(): void {
    this.socket = io({reconnection: false});

    // TODO: need to get a lobby here
    this.socket.on("connect", () => {
      this.logger.info("Connected to Server", {socket: this.getSocket().id});
      this.start();
    });
  }

  public getSocket(): Socket {
    if (this.socket === null) {
      throw new Error("Socket is null!");
    }

    return this.socket;
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
    this.logger.info("Starting Client Runtime", { mode: this.mode, flags: this.flags.join(",") });

    if (this.mode === RuntimeMode.STEPPED) {
      this.enableSteppedMode();
    }

    this.input.listen();
    this.renderer.start();
    this.sceneManager.start();

    if (this.mode !== RuntimeMode.PRODUCTION) {
      this.debug.start();
    }

    this.lastFrameTime = Date.now();
    this.update();
  }

  private update() {
    const now = Date.now();

    Time.delta = now - this.lastFrameTime;
    this.lastFrameTime = now;

    this.input.update();
    this.transactionManager.update();
    this.sceneManager.update();

    if (this.mode !== RuntimeMode.PRODUCTION) {
      this.debug.update();
    }

    this.renderer.clear();
    this.renderer.draw(this.sceneManager.getDrawableEntities());

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

  public getScene(): Scene {
    return this.sceneManager.getScene();
  }

  public getOnScreenEntities(): Entity[] {
    return this.sceneManager.getOnScreenEntities();
  }

  public hasFlag(flag: RuntimeFlag): boolean {
    return this.flags.find((f) => f === flag) !== undefined;
  }

  public getTransactions(): SerialisedTransaction[] {
    return this.transactionManager.getHistory();
  }

  /*
  public createMoveTransaction(
    piece: Piece,
    target: Tile,
  ): MoveTransaction {
    return this.transactionManager.createMoveTransaction(
      Date.now(),
      this.player,
      this.getBoard(),
      piece,
      target
    );
  }
   */

  public toggleDebugger(): void {
    this.debug.toggleEnabled();
  }

  public getBoard(): DisplayBoard {
    const scene = this.getScene();

    if (scene.getName() === "S_SANDBOX") {
      return (scene as any).getBoard() as DisplayBoard;
    }

    throw new Error("Cannot get board!");
  }

  public createPlayer(id: string, socket: Socket): ClientPlayer {
    this.player = new ClientPlayer(id, socket);

    return this.player;
  }

  public getPlayer(): ClientPlayer | null {
    return this.player;
  }

  public getAvailableMoves(piece: Piece): Vector2[] {
    return this.moveResolver.getAvailableMoves(piece);
  }
}
