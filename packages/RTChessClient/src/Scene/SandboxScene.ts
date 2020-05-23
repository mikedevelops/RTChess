import { S_SANDBOX } from "./scenes";
import WillEnter from "./WillEnter";
import Scene from "./Scene";
import { Vector2 } from "rtchess-core";
import ClientRuntime from "../Runtime/ClientRuntime";
import DisplayBoard from "../GameObject/Board/DisplayBoard";
import PlayerInputManager from "../Input/PlayerInputManager";

export default class SandboxScene extends Scene implements WillEnter {
  private board: DisplayBoard | null = null;

  public getName(): string {
    return S_SANDBOX;
  }

  public update(): boolean {
    return false;
  }

  public getBoard(): DisplayBoard {
    if (this.board === null) {
      throw new Error("DisplayBoard is NULL!");
    }

    return this.board;
  }

  public enter(): void {
    const board = new DisplayBoard();
    const boardRect = board.getWorldRect();

    this.board = board;
    ClientRuntime.instance.registerInputManager(new PlayerInputManager());
    this.addChild(board);

    board.getPosition().add(new Vector2(
      //(ClientRuntime.instance.getWidth() / 2) - (boardRect.getWidth() / 2),
      //(ClientRuntime.instance.getHeight() / 2) - (boardRect.getHeight() / 2),
    ));
  }
}
