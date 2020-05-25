import Scene from './Scene';
import WillEnter from './WillEnter';
import ClientRuntime from '../Runtime/ClientRuntime';
import DisplayLobbyList from '../UI/List/DisplayLobbyList';
import { Events, SerialisedLobby, PlayerState } from "rtchess-core";
import ClientPlayer from '../Lobby/ClientPlayer';

export default class LobbyScene extends Scene implements WillEnter {
  public getName(): string {
    return 'SCENE_LOBBY';
  }

  public update(): boolean {
    return false;
  }

  public enter(): void {
    const lobbyList = new DisplayLobbyList("LOBBY", ClientRuntime.instance.lobby.getPlayers());
    const socket = ClientRuntime.instance.getSocket();
    const logger = ClientRuntime.instance.getLogger();
    const lobby = ClientRuntime.instance.lobby;

    this.addChild(lobbyList);
    lobbyList.center();

    socket.on(Events.LobbyEvent.PLAYER_ADDED, (sl: SerialisedLobby) => {
      logger.event(`(Server -> Client) Player added to Lobby`, { player: sl.client.id, client: socket.id  });

      if (ClientRuntime.instance.getPlayer() === null) {
        lobby.addPlayer(ClientRuntime.instance.createPlayer(sl.client.id, socket));
      }

      const player = ClientRuntime.instance.getPlayer() as ClientPlayer;

      if (sl.client.state !== player.getState()) {
        if (sl.client.state === PlayerState.MATCHED) {
          socket.emit(Events.MatchEvent.READY, player.serialise());
        }
      }

      lobby.update(sl);
    });

    socket.on(Events.MatchEvent.READY, (sl: SerialisedLobby) => {
      lobby.update(sl);
    });
  }
}
