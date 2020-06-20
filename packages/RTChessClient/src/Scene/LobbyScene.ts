import Scene from './Scene';
import WillEnter from './WillEnter';
import ClientRuntime from '../Runtime/ClientRuntime';
import DisplayLobbyList from '../UI/List/DisplayLobbyList';
import ClientPlayer from '../Lobby/ClientPlayer';
import { MatchEvent } from '../../../RTChessCore/src/Match/Match';
import { PlayerState } from '../../../RTChessCore/src/Player/Player';
import { LobbyEvent, SerialisedLobby } from '../../../RTChessCore/src/Lobby/Lobby';

export default class LobbyScene extends Scene implements WillEnter {
  private start: boolean = false;

  public getName(): string {
    return 'SCENE_LOBBY';
  }

  public update(): boolean {
    return this.start;
  }

  public enter(): void {
    const lobbyList = new DisplayLobbyList("LOBBY");
    const socket = ClientRuntime.instance.getSocket();
    const logger = ClientRuntime.instance.getLogger();
    const lobby = ClientRuntime.instance.lobby;

    this.addChild(lobbyList);
    lobbyList.center();

    socket.on(LobbyEvent.PLAYER_ADDED, (sl: SerialisedLobby) => {
      logger.event(`${sl.client.id} added to Lobby`, { player: sl.client.id, client: socket.id });

      if (ClientRuntime.instance.getPlayer() === null) {
        const player = ClientRuntime.instance.createPlayer(sl.client.id, socket);

        document.title = `${player.getId()} | ${socket.id}`;
        lobby.addPlayer(player);
      }

      const player = ClientRuntime.instance.getPlayer() as ClientPlayer;

      if (sl.client.state !== player.getState()) {
        if (sl.client.state === PlayerState.MATCHED) {
          socket.emit(MatchEvent.READY, player.serialise());
        }
      }

      lobby.update(sl);
    });

    socket.on(LobbyEvent.PLAYER_REMOVED, (sl: SerialisedLobby) => {
      lobby.update(sl);
    });

    socket.on(MatchEvent.READY, (sl: SerialisedLobby) => {
      lobby.update(sl);
    });

    socket.on(MatchEvent.START, () => {
      this.start = true;
    });
  }
}
