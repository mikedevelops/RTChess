import Player from '../Player/Player';
import StringBytes from '../Primitives/StringBytes';

export default class Lobby {
  private static ID_LENGTH: number = 20;

  private players: { [index: string]: Player } = {};

  public getPlayerCount(): number {
    return Object.keys(this.players).length;
  }

  public getPlayers(): Player[] {
    const players: Player[] = [];

    for (const id in this.players) {
      if (!this.players.hasOwnProperty(id)) {
        continue;
      }

      const socket = this.players[id];

      players.push({ id: socket.id });
    }

    return players;
  }

  public add(id: string): void {
    if (this.players[id] !== undefined) {
      throw new Error("Attempted to add the same socket twice!");
    }

    this.players[id] = { id };
  }

  public remove(id: string): void {
    if (this.players[id] === undefined) {
      throw new Error("Attempted to remove a socket that was not in the lobby!");
    }

    delete this.players[id];
  }

  public parse(bytes: object): void {
    const data = Object.values(bytes);

    // Parse will fully replace the players
    this.players = {};

    for (let b = 0; b < data.length; b += Lobby.ID_LENGTH) {
      const bytes = data.slice(b, b + Lobby.ID_LENGTH);
      const id = StringBytes.toUTF8String(bytes);

      this.players[id] = { id };
    }
  }

  public serialise(): Uint8Array {
    let data: number[] = [];

    for (const id in this.players) {
      if (!this.players.hasOwnProperty(id)) {
        continue;
      }

      // NOTE: slicing at 20 chars here so it's consistent-ish
      // TODO: Check how long an id _can_ be with socket io, or just create our own
      data = [...data, ...id.slice(0, Lobby.ID_LENGTH).split("").map(s => s.charCodeAt(0))];
    }

    return Uint8Array.from(data);
  }
}

