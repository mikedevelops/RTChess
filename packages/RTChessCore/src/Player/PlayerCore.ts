import SerialisedPlayer from './SerialisedPlayer';

export enum PlayerState {
  CONNECTED,
  MATCHED,
  READY,
  PLAYING
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
}
