import ServerRuntime from '../Runtime/ServerRuntime';
import ServerPlayer from './ServerPlayer';
import Lobby, { LobbyType } from '../../../RTChessCore/src/Lobby/Lobby';
import Match, { MatchEvent } from '../../../RTChessCore/src/Match/Match';
import Monolog from '../../../RTChessCore/src/Logging/Monolog';

export default class ServerLobby extends Lobby {
  protected getLogger(): Monolog {
    return ServerRuntime.instance.getLogger();
  }

  protected getType(): LobbyType {
    return LobbyType.SERVER;
  }

  protected createMatch(match: Match): void {
    super.createMatch(match);

    /**
     * Let the clients know they are matched
     */

    const [p1,p2] = this.getMatchPlayers(match);

    p1.getSocket().emit(MatchEvent.MATCHED);
    p2.getSocket().emit(MatchEvent.MATCHED);
  }

  private getMatchPlayers(match: Match): [ServerPlayer,ServerPlayer] {
    const [p1,p2] = match.getPlayers();

    if (!(p1 instanceof ServerPlayer) || !(p2 instanceof ServerPlayer)) {
      throw new Error("Could not get match players!");
    }

    return [p1 as ServerPlayer,p2 as ServerPlayer];
  }
}
