import State from "./State";
import { instanceOfEnterState } from "./EnterState";
import { instanceOfExitState } from "./ExitState";

export default class StateMachine {
  private state: State | null = null;

  public getState(): State | null {
    return this.state;
  }

  public start(state: State): void {
    this.setState(state);
  }

  public update(): void {
    if (this.state === null) {
      return;
    }

    const next: State | null = this.state.update();

    if (next === null) {
      return;
    }

    this.setState(next);
  }

  protected setState(next: State): void {
    if (this.state !== null && instanceOfExitState(this.state)) {
      this.state.leave();
    }

    if (instanceOfEnterState(next)) {
      next.enter();
    }

    this.state = next;
  }
}
export type StateConstructor = new (...args: any[]) => State;
