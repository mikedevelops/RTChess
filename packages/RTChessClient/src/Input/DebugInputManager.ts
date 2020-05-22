import AbstractInputManager from "../Input/AbstractInputManager";
import { InputEvent } from "../Input/InputDelegator";
import { KEY_UNDO, KEY_REDO, KEY_TOGGLE_DEBUG } from "../Input/keys";
import Runtime from "../Runtime/Runtime";

// TODO: re-do this stuff...

export default class DebugInputManager extends AbstractInputManager {
  public handleKeys(events: InputEvent[]): void {
    for (const event of events) {
      switch (event.target) {
        case KEY_TOGGLE_DEBUG:
          Runtime.instance.toggleDebugger();
          return;
        case KEY_UNDO:
          //Runtime.instance.undo(1);
          return;
        case KEY_REDO:
          //Runtime.instance.redo(1);
          return;
        default:
          return;
      }
    }
  }
}
