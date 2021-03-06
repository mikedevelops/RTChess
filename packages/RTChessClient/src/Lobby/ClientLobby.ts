import ClientRuntime from '../Runtime/ClientRuntime';
import ClientPlayer from './ClientPlayer';
import Lobby, { LobbyType, SerialisedLobby } from '../../../RTChessCore/src/Lobby/Lobby';
import { PlayerState } from '../../../RTChessCore/src/Player/Player';
import Match from '../../../RTChessCore/src/Match/Match';
import Monolog from '../../../RTChessCore/src/Logging/Monolog';

export default class ClientLobby extends Lobby {
  public getLogger(): Monolog {
    return ClientRuntime.instance.logger;
  }

  public getType(): LobbyType {
    return LobbyType.CLIENT;
  }

  public createPlayer(id: string, state: PlayerState): ClientPlayer {
    return new ClientPlayer(id, ClientRuntime.instance.getSocket(), state);
  }

  public update(lobby: SerialisedLobby): void {
    let created = 0, updated = 0, removed = 0;

    /**
     * Remove matches that no longer exist
     */
    for (const match of this.getMatches()) {
      const exists = lobby.matches.find(m => m.id === match.getId());

      if (exists !== undefined) {
        continue;
      }

      this.abortMatch(match);
    }

    /*

    /**
     * Remove players that no longer exist
     */
    for (const player of this.getPlayers()) {
      const exists = lobby.players.find(p => p.id === player.getId());

      if (exists !== undefined) {
        continue;
      }

      removed++;
      this.removePlayer(player);
    }

    /**
     * Create / Update existing players
     */
    for (const player of lobby.players) {
      let exists;

      try {
        exists = this.getPlayerById(player.id);
      } catch(e) {
        created++;
        this.addPlayer(this.createPlayer(player.id, player.state));

        continue;
      }

      if (exists.getState() !== player.state) {
        exists.setState(player.state);
        updated++;
      }
    }

    /**
     * Create / Update matches – (do this after players!)
     */
    for (const match of lobby.matches) {
      const p1 = this.getPlayerById(match.playerOne.id);
      const p2 = this.getPlayerById(match.playerTwo.id);

      if (p1 === undefined || p2 === undefined) {
        throw new Error("Trying to create a match with players that are not in the lobby!");
      }

      if (this.getMatchById(match.id) === null) {
        this.createMatch(new Match(p1, p2));
      }
    }

    if (created + updated + removed === 0) {
      this.getLogger().verbose(`No ${this.getType()} Lobby update required`);
    } else {
      this.getLogger().verbose(`Updated ${this.getType()} Lobby`, { created: created.toString(), updated: updated.toString(), removed: removed.toString()});
    }
  };
}
