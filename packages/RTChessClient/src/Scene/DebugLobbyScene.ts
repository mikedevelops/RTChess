import WillEnter from './WillEnter';
import Scene from './Scene';
import ClientRuntime from '../Runtime/ClientRuntime';
import DisplayLobbyList from '../UI/List/DisplayLobbyList';
import { MatchEvent } from '../../../RTChessCore/src/Match/Match';
import { LobbyEvent, SerialisedLobby } from '../../../RTChessCore/src/Lobby/Lobby';

export default class DebugLobbyScene extends Scene implements WillEnter {
  private start: boolean = false;

  public getName(): string {
    return 'SCENE_SINGLE_PLAYER_LOBBY';
  }

  public update(): boolean {
    return this.start;
  }

  public enter(): void {
    const lobbyList = new DisplayLobbyList("LOBBY");

    const socket = ClientRuntime.instance.getSocket();
    const lobby = ClientRuntime.instance.lobby;
    const player1 = ClientRuntime.instance.createPlayer("player 1", socket);
    const player2 = ClientRuntime.instance.createPlayer("player 2", socket);

    this.addChild(lobbyList);
    lobbyList.center();

    socket.on(LobbyEvent.PLAYER_ADDED, (sl: SerialisedLobby) => {
      lobby.update(sl);
    });

    lobby.addPlayer(player1);
    lobby.addPlayer(player2);

    // socket.emit(MatchEvent.READY, player1.serialise());
    // socket.emit(MatchEvent.READY, player2.serialise());
  }
}
