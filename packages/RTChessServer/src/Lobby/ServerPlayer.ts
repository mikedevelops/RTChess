import { PlayerCore, SerialisedPlayer, PlayerState } from 'rtchess-core';

export default class ServerPlayer implements PlayerCore {
  private state: PlayerState = PlayerState.CONNECTED;

  constructor(private id: string) {}

  public getId(): string {
    return this.id;
  }

  public getState(): PlayerState {
    return this.state;
  }

  public setState(state: PlayerState): void {
    this.state = state;
  }

  public serialise(): SerialisedPlayer {
    return {
      id: this.getId(),
      state: this.getState(),
    };
  }
}
