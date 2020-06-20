import ClientRuntime from '../Runtime/ClientRuntime';
import Socket = SocketIOClient.Socket;
import { PlayerCore, PlayerState, PlayerType, SerialisedPlayer } from '../../../RTChessCore/src/Player/Player';

export default class ClientPlayer implements PlayerCore {
  constructor(
    private id: string,
    private socket: Socket | null = null,
    private state: PlayerState = PlayerState.CONNECTED,
    private readonly type: PlayerType = PlayerType.HUMAN,
  ) {}

  public getId(): string {
    return this.id;
  }

  public setSocket(socket: Socket): void {
    this.socket = socket;
  }

  public getSocket(): Socket {
    if (this.socket === null) {
      throw new Error("Attempted to get socket before it was set!");
    }

    return this.socket;
  }

  public getState(): PlayerState {
    return this.state;
  }

  public setState(state: PlayerState): void {
    this.state = state;
  }

  public getType(): PlayerType {
    return this.type;
  }

  public isClientPlayer(): boolean {
    const player = ClientRuntime.instance.getPlayer();

    if (player === null) {
      return false;
    }

    return player.getSocket().id === this.getSocket().id;
  }

  public serialise(): SerialisedPlayer {
    return {
      id: this.getId(),
      state: this.getState()
    };
  }
}
