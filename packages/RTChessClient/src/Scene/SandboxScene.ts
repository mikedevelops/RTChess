import { S_SANDBOX } from "./scenes";
import WillEnter from "./WillEnter";
import Scene from "./Scene";
import Vector2 from "../Math/Vector2";
import Runtime from "../Runtime/Runtime";
import Board from "../GameObject/Board/Board";
import PlayerInputManager from "../Input/PlayerInputManager";
import Tile from "../GameObject/Board/Tile";

export default class SandboxScene extends Scene implements WillEnter {
  private board: Board | null = null;

  public getName(): string {
    return S_SANDBOX;
  }

  public update(): boolean {
    return false;
  }

  public getBoard(): Board {
    if (this.board === null) {
      throw new Error("Board is NULL!");
    }

    return this.board;
  }

  public enter(): void {
    const board = new Board();

    this.board = board;
    Runtime.instance.registerInputManager(new PlayerInputManager());
    this.addChild(board);

    board.getPosition().add(Vector2.unit(1, 4, Tile.SIZE));
  }
}
