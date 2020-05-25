import SerialisedPlayer from './SerialisedPlayer';

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

export const playerStateToString = (state: PlayerState): string => {
  switch(state) {
    case PlayerState.CONNECTED:
      return "CONNECTED";
    case PlayerState.MATCHED:
      return "MATCHED";
    case PlayerState.READY:
      return "READY";
    case PlayerState.PLAYING:
      return "PLAYING";
  }
}

export default interface PlayerCore {
  getId(): string;
  getState(): PlayerState;
  setState(state: PlayerState): void;
  serialise(): SerialisedPlayer;
  getType(): PlayerType;
  isClientPlayer(): boolean;
}
