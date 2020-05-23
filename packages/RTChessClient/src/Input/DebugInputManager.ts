import AbstractInputManager from "../Input/AbstractInputManager";
import { InputEvent } from './InputDelegator';
import { KEY_UNDO, KEY_REDO, KEY_TOGGLE_DEBUG } from './keys';
import ClientRuntime from "../Runtime/ClientRuntime";

export default class DebugInputManager extends AbstractInputManager {
  public handleKeys(events: InputEvent[]): void {
    for (const event of events) {
      switch (event.target) {
        case KEY_TOGGLE_DEBUG:
          ClientRuntime.instance.toggleDebugger();
          return;
        case KEY_UNDO:
          //ClientRuntime.instance.undo(1);
          return;
        case KEY_REDO:
          //ClientRuntime.instance.redo(1);
          return;
        default:
          return;
      }
    }
  }
}
