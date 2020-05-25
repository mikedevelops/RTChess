import { PlayerCore, SerialisedPlayer, PlayerState, PlayerType } from 'rtchess-core';
import { Socket } from 'socket.io';

export default class ServerPlayer implements PlayerCore {
  constructor(
    private id: string,
    private socket: Socket,
    private state: PlayerState = PlayerState.CONNECTED,
    private type: PlayerType = PlayerType.HUMAN
  ) {}

  public getSocket(): Socket {
    return this.socket;
  }

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

  public isClientPlayer(): boolean {
    return false;
  }

  public getType(): PlayerType {
    return this.type;
  }
}
