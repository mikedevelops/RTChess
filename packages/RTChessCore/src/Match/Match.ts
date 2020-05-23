import PlayerCore, { PlayerState } from '../Player/PlayerCore';
import { SerialisedTransaction } from '../Transaction/SerialisedTransaction';
import Queue from '../Primitives/Queue';
import { SerialisedMatch } from './SerialisedMatch';

export default class Match {
  private transactions: Queue<SerialisedTransaction> = new Queue();
  private id: string;

  constructor(
    private playerOne: PlayerCore,
    private playerTwo: PlayerCore,
  ) {
    this.id = this.playerOne.getId();

    this.playerOne.setState(PlayerState.MATCHED);
    this.playerTwo.setState(PlayerState.MATCHED);
  }

  public getPlayerOne(): PlayerCore {
    return this.playerOne;
  }

  public getPlayerTwo(): PlayerCore {
    return this.playerTwo;
  }

  public getPlayers(): PlayerCore[] {
    return [this.playerOne, this.playerTwo];
  }

  public isReady(): boolean {
    return false;
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
