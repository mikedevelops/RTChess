import { Server, Socket } from 'socket.io';
import ServerPlayer from '../Lobby/ServerPlayer';
import Runtime from '../../../RTChessCore/src/Runtime/Runtime';
import Lobby, { LobbyEvent } from '../../../RTChessCore/src/Lobby/Lobby';
import { SerialisedPlayer } from '../../../RTChessCore/src/Player/Player';
import Monolog from '../../../RTChessCore/src/Logging/Monolog';
import Match, { MatchEvent, SerialisedMove } from '../../../RTChessCore/src/Match/Match';
import MonologServer from '../Logger/MonologServer';

export default class ServerRuntime extends Runtime {
  private logger: Monolog = new MonologServer();
  private matches: { [index: string]: Match } = {};

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

  public getLogger(): Monolog {
    return this.logger;
  }

  public start(): void {
    this.io.on("connection", (socket: Socket) => {
      const player = new ServerPlayer(this.getId(), socket);

      this.logger.info("Player Connected", { id: socket.id });
      this.lobby.addPlayer(player);
      this.logger.info("Player Added to Lobby", { id: socket.id });
      this.lobby.matchmake();

      this.forEachPlayer((player: ServerPlayer) => {
        player.getSocket().emit(LobbyEvent.PLAYER_ADDED, this.lobby.serialise(player.getId()));
      });

      socket.on("disconnect", () => {
        this.logger.info("Client Disconnected", { id: socket.id });
        this.lobby.removePlayer(player);
        this.lobby.matchmake();

        this.forEachPlayer((player: ServerPlayer) => {
          player.getSocket().emit(LobbyEvent.PLAYER_REMOVED, this.lobby.serialise(player.getId()));
        });
      });

      // TODO: factor these handlers out
      socket.on(MatchEvent.READY, (sp: SerialisedPlayer) => {
        const match = this.lobby.setPlayerReady(sp.id);

        this.forEachPlayer((player: ServerPlayer) => {
          player.getSocket().emit(MatchEvent.READY, this.lobby.serialise(player.getId()));
        });

        if (!match.isReady()) {
          return;
        }

        this.forEachPlayer((player: ServerPlayer) => {
          player.getSocket().emit(MatchEvent.START);
        });

        this.matches[match.getId()] = match;

        socket.on(MatchEvent.MOVE, (move: SerialisedMove) => {
          console.log(move);
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
