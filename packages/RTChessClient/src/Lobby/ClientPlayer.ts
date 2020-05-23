import { PlayerCore, PlayerState, SerialisedPlayer } from 'rtchess-core';

export default class ClientPlayer implements PlayerCore {
  constructor(
    private id: string,
    private state: PlayerState = PlayerState.CONNECTED
  ) {}

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
      state: this.getState()
    };
  }
}
