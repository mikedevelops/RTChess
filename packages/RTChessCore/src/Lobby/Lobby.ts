import SerialisedPlayer from '../Player/SerialisedPlayer';
import Match from '../Match/Match';
import PlayerCore, { PlayerState } from '../Player/PlayerCore';
import { SerialisedMatch } from '../Match/SerialisedMatch';

export interface SerialisedLobby {
  players: SerialisedPlayer[];
}

export default abstract class Lobby {
  private players: Map<string, PlayerCore> = new Map();
  private matches: Map<PlayerCore, Match> = new Map();

  public getPlayerCount(): number {
    return Object.keys(this.players).length;
  }

  public getPlayers(): PlayerCore[] {
    return [...this.players.values()];
  }

  public addPlayer(player: PlayerCore): void {
    if (this.players.has(player.getId())) {
      throw new Error("Trying to add player to a lobby they are already in!");
    }

    this.players.set(player.getId(), player);
  }

  public updatePlayer(id: string, state: PlayerState): PlayerCore {
    if (!this.players.has(id)) {
      throw new Error("Trying to update a player that does not exist!");
    }

    const player = this.players.get(id) as PlayerCore;

    player.setState(state);

    return player;
  }

  public removePlayer(player: PlayerCore): void {
    if (!this.players.has(player.getId()) === undefined) {
      throw new Error("Attempted to remove a socket that was not in the lobby!");
    }

    const match = this.matches.get(player);

    if (match === undefined) {
      return;
    }

    for (const player of match.getPlayers()) {
      player.setState(PlayerState.CONNECTED);
      this.matches.delete(player);
    }

    this.players.delete(player.getId());
  }

  // TODO: a place to look to optimize
  public update(players: PlayerCore[]): void {
    this.players.clear();

    for (const player of players) {
      this.players.set(player.getId(), player);
    }
  };

  public serialise(): SerialisedLobby {
    return {
      players: [...this.players.values()].map(p => p.serialise())
    };
  }

  public getNewMatches(): Match[] {
    const matches: Match[] = [];
    const connected = [...this.players.values()].filter(p => p.getState() === PlayerState.CONNECTED);

    if (connected.length < 2) {
      return [];
    }

    const sliced = connected.slice(0, Math.floor(connected.length / 2) + 1);

    for (let i = 0; i < sliced.length; i += 2) {
      const playerOne = sliced[i];
      const playerTwo = sliced[i + 1];
      const match = new Match(playerOne, playerTwo);

      matches.push(match);
      this.matches.set(playerOne, match);
      this.matches.set(playerTwo, match);
    }

    return matches;
  }
}

