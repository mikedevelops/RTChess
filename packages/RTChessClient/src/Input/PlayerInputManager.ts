import AbstractInputManager from "./AbstractInputManager";
import { InputEvent } from "./InputDelegator";
import ClientRuntime from "../Runtime/ClientRuntime";

enum MouseButton {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2
}

export default class PlayerInputManager extends AbstractInputManager {
  public handlePointer(events: InputEvent[]): void {
    events.forEach((event: InputEvent) => {
      switch(parseInt(event.target, 10)) {
        case MouseButton.LEFT:
          ClientRuntime.instance.getBoard().selectTileAtWorldPosition(event.position);
          return;
      }
    });
  }
}

