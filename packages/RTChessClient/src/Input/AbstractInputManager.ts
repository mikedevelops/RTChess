import { InputEvent } from "../Input/InputDelegator";

export default abstract class AbstractInputManager {
  public enabled: boolean = true;

  public handleKeys(events: InputEvent[]): void {};
  public handlePointer(events: InputEvent[]): void {};

  public toggleEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}
