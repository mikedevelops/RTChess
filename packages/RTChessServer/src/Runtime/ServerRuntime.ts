import { Logger, Runtime, Lobby, Events, SerialisedPlayer, PlayerState } from 'rtchess-core';
import { Server, Socket } from 'socket.io';
import PlayerCore from '../Lobby/ServerPlayer';
import ServerPlayer from '../Lobby/ServerPlayer';

export default class ServerRuntime extends Runtime {
  private logger: Logger = new Logger();

  public static instance: ServerRuntime;

  constructor(
    private io: Server,
    private lobby: Lobby
  ) {
    super();

    if (ServerRuntime.instance !== undefined) {
      throw new Error("Attempted to create another " + this.constructor.name);
    }

    ServerRuntime.instance = this;
    (global as any).__runtime = this;
  }

  public getLogger(): Logger {
    return this.logger;
  }

  public start(): void {
    this.io.on("connection", (socket: Socket) => {
      const player = new ServerPlayer(this.getId(), socket);

      this.logger.info("Client Connected", { socket: socket.id });
      this.lobby.addPlayer(player);
      this.lobby.matchmake();

      this.forEachPlayer((player: ServerPlayer) => {
        this.logger.event(`(Server -> Client) Player Added`, { player: player.getId(), socket: player.getSocket().id });
        player.getSocket().emit(Events.LobbyEvent.PLAYER_ADDED, this.lobby.serialise(player.getId()));
      });

      socket.on("disconnect", () => {
        this.logger.info("Client Disconnected", { socket: socket.id });
        this.lobby.removePlayer(player);
        this.lobby.matchmake();

        this.forEachPlayer((player: ServerPlayer) => {
          player.getSocket().emit(Events.LobbyEvent.PLAYER_REMOVED, this.lobby.serialise(player.getId()));
        });
      });

      socket.on(Events.MatchEvent.READY, (sp: SerialisedPlayer) => {
        this.lobby.setPlayerReady(sp.id);
        this.forEachPlayer((player: ServerPlayer) => {
          player.getSocket().emit(Events.MatchEvent.READY, this.lobby.serialise(player.getId()));
        });
      });
    });
  }

  private forEachPlayer(cb: (player: ServerPlayer) => void): void {
    const players: ServerPlayer[] = this.lobby.getPlayersByType<ServerPlayer>(ServerPlayer);

    for (const player of players) {
      cb(player);
    }
  }
}
