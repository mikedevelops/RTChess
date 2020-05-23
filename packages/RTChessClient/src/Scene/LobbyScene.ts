import Scene from './Scene';
import WillEnter from './WillEnter';
import ClientRuntime from '../Runtime/ClientRuntime';
import DisplayLobbyList from '../UI/List/DisplayLobbyList';

export default class LobbyScene extends Scene implements WillEnter {
  public getName(): string {
    return 'SCENE_LOBBY';
  }

  public update(): boolean {
    return false;
  }

  public enter(): void {
    const lobby = new DisplayLobbyList("LOBBY", ClientRuntime.instance.lobby.getPlayers());

    this.addChild(lobby);

    lobby.center();
  }
}
