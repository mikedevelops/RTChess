import Queue from '../Primitives/Queue';
import { PlayerCore, PlayerState, SerialisedPlayer } from '../Player/Player';
import { SerialisedTransaction } from '../Transaction/Transaction';
import SerialisedPiece from '../Board/SerialisedPiece';
import { SerialisedVector2 } from '../Primitives/Vector2';

export enum MatchState {
  READYING = "READYING",
  LOADING = "LOADING",
  PLAYING = "PLAYING",
  FINALISING = "FINALISING",
  ABORTED = "ABORTED",
}

export enum MatchEvent {
  MATCHED = "SERVER:MATCH:MATCHED",
  READY = "SERVER:MATCH:READY",
  START = "SERVER:MATCH:START",
  MOVE = "SERVER:MATCH:MOVE",
}

export interface SerialisedMove {
  player: SerialisedPlayer;
  piece: SerialisedPiece;
  position: SerialisedVector2;
}

export interface SerialisedMatch {
  id: string;
  playerOne: SerialisedPlayer;
  playerTwo: SerialisedPlayer;
}

export default class Match {
  private transactions: Queue<SerialisedTransaction> = new Queue();
  private readonly id: string;

  constructor(
    private playerOne: PlayerCore,
    private playerTwo: PlayerCore,
    private state: MatchState = MatchState.READYING
  ) {
    this.id = this.playerOne.getId();

    this.playerOne.setState(PlayerState.MATCHED);
    this.playerTwo.setState(PlayerState.MATCHED);
  }

  public abort(): void {
    this.playerOne.setState(PlayerState.CONNECTED);
    this.playerTwo.setState(PlayerState.CONNECTED);
    this.state = MatchState.ABORTED;
  }

  public getId(): string {
    return this.id;
  }

  public setState(state: MatchState): void {
    this.state = state;
  }

  public getState(): MatchState {
    return this.state;
  }

  public getPlayerOne(): PlayerCore {
    return this.playerOne;
  }

  public getPlayerTwo(): PlayerCore {
    return this.playerTwo;
  }

  public getPlayers(): [PlayerCore,PlayerCore] {
    return [this.playerOne, this.playerTwo];
  }

  public getOpponent(playerId: string): PlayerCore {
    if (this.playerOne.getId() === playerId) {
      return this.playerTwo;
    }

    if (this.playerTwo.getId() === playerId) {
      return this.playerOne;
    }

    throw new Error(`Cannot get opponent for Player "${playerId}" because they are not in the match`);
  }

  public isReady(): boolean {
    return this.playerOne.getState() === PlayerState.READY &&
      this.playerTwo.getState() === PlayerState.READY;
  }

  public serialise(): SerialisedMatch {
    return {
      id: this.id,
      playerOne: this.playerOne.serialise(),
      playerTwo: this.playerTwo.serialise(),
    };
  }
}
