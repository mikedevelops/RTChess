import PlayerCore, { PlayerState } from '../Player/PlayerCore';
import { SerialisedTransaction } from '../Transaction/SerialisedTransaction';
import Queue from '../Primitives/Queue';
import { SerialisedMatch } from './SerialisedMatch';

export enum MatchState {
  READYING = "READYING",
  LOADING = "LOADING",
  PLAYING = "PLAYING",
  FINALISING = "FINALISING",
  ABORTED = "ABORTED",
}

export default class Match {
  private transactions: Queue<SerialisedTransaction> = new Queue();
  private id: string;

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

  public start(): void {

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

  public createMoveTransaction(transaction: SerialisedTransaction): void {
    if (this.transactions.has(transaction)) {
      throw new Error("CLASH!");
    }

    this.transactions.enqueue(transaction);
  }

  public serialise(): SerialisedMatch {
    return {
      id: this.id,
      playerOne: this.playerOne.serialise(),
      playerTwo: this.playerTwo.serialise(),
    };
  }

  public update(): void {
  }
}
