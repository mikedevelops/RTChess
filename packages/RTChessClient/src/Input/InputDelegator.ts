import AbstractInputManager from "./AbstractInputManager";
import { Vector2 } from 'rtchess-core';

export enum EventType {
  KEY = "KEY",
  POINTER = "POINTER"
}

export interface InputEvent {
  time: number;
  type: EventType;
  target: string;
  handler: string[];
  position: Vector2;
}

export default class InputDelegator {
  public static MAX_HISTORY = 5;
  public buffer: InputEvent[] = [];
  public pressed: boolean = false;

  private upNextFrame: boolean = false;
  private managers: Set<AbstractInputManager> = new Set();
  private history: InputEvent[] = [];

  public getHistory(): InputEvent[] {
    return this.history;
  }

  public register(manager: AbstractInputManager): void {
    this.managers.add(manager);
  }

  public listen() {
    const upBound = this.handleKeyUp.bind(this);
    const downBound = this.handleKeyDown.bind(this);
    const pointerDownBound = this.handlePointerDown.bind(this);

    window.addEventListener("keydown", downBound);
    window.addEventListener("keyup", upBound);
    window.addEventListener("pointerdown", pointerDownBound);
    window.addEventListener("contextmenu", event => event.preventDefault());
  }

  public update(): void {
    if (this.buffer.length > 0) {
      this.invokeDownHandlers();
    }

    if (this.pressed && !this.upNextFrame) {
      this.upNextFrame = true;

      return;
    }

    this.pressed = false;
    this.upNextFrame = false;
  }

  private handlePointerDown(event: MouseEvent): void {
    this.buffer.push({
      time: event.timeStamp,
      target: event.button.toString(),
      handler: [],
      type: EventType.POINTER,
      position: new Vector2(event.pageX, event.pageY)
    });

    event.preventDefault();
  }

  private handleKeyDown(event: KeyboardEvent) {
    this.buffer.push({
      // TODO: this is laziness... key events should not
      // have positions!
      position: Vector2.zero(),
      time: event.timeStamp,
      target: event.key,
      handler: [],
      type: EventType.KEY,
    });

    this.pressed = true;
  }

  private handleKeyUp() {
    this.pressed = false;
  }

  private invokeDownHandlers() {
    const key = this.buffer.filter(e => e.type === EventType.KEY);
    const pointer = this.buffer.filter(e => e.type === EventType.POINTER);

    this.managers.forEach((manager) => {
      if (manager.isEnabled()) {
        // Add the input manager name to the event
        this.buffer.forEach((e) => e.handler.push(manager.constructor.name));
        // Pass a copy of the buffer here
        manager.handleKeys(key);
        manager.handlePointer(pointer);
      }
    });

    this.updateHistory();
    this.buffer = [];
  }

  private removeFromHistory(event: InputEvent): void {
    this.history = this.history.filter((e) => e !== event);
  }

  private updateHistory(): void {
    const { MAX_HISTORY } = InputDelegator;
    const lifetime = 10000;

    // Clear hisotry entries after lifetime
    this.buffer.forEach((e) =>
      setTimeout(() => this.removeFromHistory(e), lifetime)
    );

    if (this.history.length + this.buffer.length < MAX_HISTORY) {
      this.history = [...this.history, ...this.buffer];

      return;
    }

    this.history = this.history
      .slice(this.history.length - (MAX_HISTORY - this.buffer.length))
      .concat(this.buffer);

    if (this.history.length > MAX_HISTORY) {
      console.error("bad history maths");
    }
  }
}
