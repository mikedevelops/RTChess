import AbstractInputManager from "./AbstractInputManager";
import { InputEvent } from "./InputDelegator";
import Piece from "../GameObject/Piece/Piece";
import Runtime from "../Runtime/Runtime";
import Vector2 from "../Math/Vector2";

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
          Runtime.instance.getBoard().selectTileAtWorldPosition(event.position);
          return;
      }
    });
  }

}
