export enum PlayerState {
  CONNECTED = "CONNECTED",
  MATCHED = "MATCHED",
  READY = "READY",
  PLAYING = "PLAYING"
}

export enum PlayerType {
  BOT = "BOT",
  HUMAN = "HUMAN",
}

export interface SerialisedPlayer {
  id: string;
  state: PlayerState;
}

export interface PlayerCore {
  getId(): string;
  getState(): PlayerState;
  setState(state: PlayerState): void;
  serialise(): SerialisedPlayer;
  getType(): PlayerType;
  isClientPlayer(): boolean;
}
