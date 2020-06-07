import DisplayList from './DisplayList';
import Color from '../../Renderer/Color';
import ClientRuntime from '../../Runtime/ClientRuntime';
import { PlayerCore, PlayerState } from '../../../../RTChessCore/src/Player/Player';
import Vector2 from '../../../../RTChessCore/src/Primitives/Vector2';

export default class DisplayLobbyList extends DisplayList<PlayerCore> {
  protected getItems(): PlayerCore[] {
    return ClientRuntime.instance.lobby.getPlayers();
  }

  protected drawItem(ctx: CanvasRenderingContext2D, player: PlayerCore, position: Vector2) {
    switch(player.getState()) {
      case PlayerState.CONNECTED:
        ctx.fillStyle = Color.RED.toString();
        break;
      case PlayerState.MATCHED:
        ctx.fillStyle = Color.ORANGE.toString();
        break;
      case PlayerState.READY:
        ctx.fillStyle = Color.GREEN.toString();
        break;
      case PlayerState.PLAYING:
        ctx.fillStyle = Color.YELLOW.toString();
        break;
    }

    ctx.fillText(
      `${player.isClientPlayer() ? "* " : ""}${player.getId()} ${(player.getState())}`,
      position.x,
      position.y
    );
  }
}
