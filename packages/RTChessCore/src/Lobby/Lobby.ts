import Match, { SerialisedMatch } from '../Match/Match';
import { PlayerCore, PlayerState, SerialisedPlayer } from '../Player/Player';
import Monolog from '../Logging/Monolog';

export enum LobbyEvent {
  PLAYER_ADDED = "LOBBY:PLAYER_ADDED",
  PLAYER_REMOVED = "LOBBY:PLAYER_REMOVED",
}

export enum LobbyType {
  CLIENT = "CLIENT",
  SERVER =  "SERVER",
}

export interface SerialisedLobby {
  client: SerialisedPlayer;
  players: SerialisedPlayer[];
  matches: SerialisedMatch[];
}

export default abstract class Lobby {
  private players: Map<string, PlayerCore> = new Map();
  private matchesByPlayer: Map<PlayerCore, Match> = new Map();
  private matchesById: Map<string, Match> = new Map();

  protected abstract getLogger(): Monolog;
  protected abstract getType(): LobbyType;

  public getPlayerCount(): number {
    return Object.keys(this.players).length;
  }

  public getPlayers(): PlayerCore[] {
    return [...this.players.values()];
  }

  public setPlayerReady(id: string): Match {
    const player = this.players.get(id);

    if (player === undefined) {
      throw new Error(`Trying to set a Player "${id}" ready that we can't find`);
    }

    player.setState(PlayerState.READY);

    const match = this.matchesByPlayer.get(player);

    if (match === undefined) {
      throw new Error(`Trying to set a Player "${id}" ready that is not in a Match`);
    }

    return match;
  }

  public getPlayersByType<T>(type: any): T[] {
    // TODO: This is probably bad typesctipt!!!!
    const players: T[] = [];

    for (const player of this.players.values()) {
      if (player instanceof type)  {
        players.push(<unknown>player as T);
      }
    }

    return players;
  }

  public getPlayerById(id: string): PlayerCore {
    const player = this.players.get(id);

    if (player === undefined) {
      throw new Error("Trying to get a player that does not exist!");
    }

    return player;
  }

  public getMatches(): Match[] {
    return [...this.matchesById.values()];
  }

  public getMatchById(id: string): Match | null {
    const match = this.matchesById.get(id);

    if (match === undefined) {
      return null;
    }

    return match;
  }

  public getMatchByPlayer(player: PlayerCore): Match | null {
    const match = this.matchesByPlayer.get(player);

    if (match === undefined) {
      return null;
    }

    return match;
  }

  public addPlayer(player: PlayerCore): void {
    if (this.players.has(player.getId())) {
      this.getLogger().error(`Trying to add player to a ${this.getType()} lobby they are already in`, { player: player.getId() });
      return;
    }

    this.players.set(player.getId(), player);
    this.getLogger().verbose(`Added player to ${this.getType()} lobby`, { player: player.getId() });
  }

  public removePlayer(player: PlayerCore): void {
    if (!this.players.has(player.getId()) === undefined) {
      this.getLogger().error(`Trying to remove player from the ${this.getType()} lobby that they are not in`, {player: player.getId()});
      return;
    }

    const match = this.matchesByPlayer.get(player);

    if (match !== undefined) {
      this.abortMatch(match);
    }

    this.players.delete(player.getId());
    this.getLogger().verbose(`Removed player from ${this.getType()} lobby`, { player: player.getId() });
  }

  public updateMatches(): void {
    for (const match of this.matchesById.values()) {
      if (match.isReady()) {
        // TODO: Start Match!
      }
    }
  }

  public serialise(playerId: string): SerialisedLobby {
    const player = this.getPlayers().find(p => p.getId() === playerId);

    if (player === undefined) {
      throw new Error(`Could not find Client "${playerId}" in Lobby`);
    }

    return {
      players: this.getPlayers().map(p => p.serialise()),
      matches: this.getMatches().map(m => m.serialise()),
      client: player.serialise(),
    };
  }

  /**
   * Matchmake
   */
  public matchmake(): void {
    if (this.getType() !== LobbyType.SERVER) {
      throw new Error("Attempted to get matches from a non SERVER Lobby");
    }

    this.getLogger().info("Matchmaking");

    const connected = [...this.players.values()].filter(p => p.getState() === PlayerState.CONNECTED);

    if (connected.length < 2) {
      this.getLogger().info("Not enough Players for a Match");

      return;
    }

    const sliced = connected.slice(0, Math.floor(connected.length / 2) + 1);

    for (let i = 0; i < sliced.length; i += 2) {
      const playerOne = sliced[i];
      const playerTwo = sliced[i + 1];

      this.createMatch(new Match(playerOne, playerTwo));
    }
  }

  /**
   * Create Match
   * @param match
   */
  protected createMatch(match: Match): void {
    const [p1,p2] = match.getPlayers();

    this.getLogger().info(`Match Created!`, { id: match.getId(), p1: p1.getId(), p2: p2.getId() });
    this.matchesByPlayer.set(p1, match);
    this.matchesByPlayer.set(p2, match);
    this.matchesById.set(match.getId(), match);
  }

  protected abortMatch(match: Match): void {
    const [p1, p2] = match.getPlayers();

    match.abort();
    this.getLogger().info(`Match Aborted`, { math: match.getId() });
    this.matchesByPlayer.delete(p1);
    this.matchesByPlayer.delete(p2);
    this.matchesById.delete(match.getId());
  }
}

