import { Runtime, PlayerCore, Lobby, Events, Match, PlayerState, SerialisedPlayer } from 'rtchess-core';
import { Server, Socket } from 'socket.io';
import ServerPlayer from '../Lobby/ServerPlayer';

export default class ServerRuntime extends Runtime {
  private sockets: Map<ServerPlayer, Socket> = new Map();

  constructor(
    private io: Server,
    private lobby: Lobby
  ) {
    super();
  }

  public start(): void {
    this.io.on("connection", (socket: Socket) => {
      const player = new ServerPlayer(socket.id);

      this.sockets.set(player, socket);
      this.lobby.addPlayer(player);
      this.handleLobbyUpdate();

      socket.on("disconnect", () => {
        this.sockets.delete(player);
        this.lobby.removePlayer(player);
        this.handleLobbyUpdate();
      });

      socket.on(Events.MatchEvent.READY, (player: SerialisedPlayer) => {
        this.lobby.updatePlayer(player.id, PlayerState.READY);
        this.handleLobbyUpdate();
      });
    });
  }

  private handleLobbyUpdate(): void {
    const matches = this.lobby.getNewMatches();
    const lobby = this.lobby.serialise();

    for (const match of matches) {
      this.sockets.get(match.getPlayerOne() as ServerPlayer).emit(Events.MatchEvent.MATCHED);
      this.sockets.get(match.getPlayerTwo() as ServerPlayer).emit(Events.MatchEvent.MATCHED);
    }

    for (const [player,socket] of this.sockets.entries()) {
      socket.emit(Events.LobbyEvent.PUBLISH_UPDATE, lobby);
    }
  }
}
