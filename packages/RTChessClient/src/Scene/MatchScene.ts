import Scene from './Scene';
import WillEnter from './WillEnter';
import DisplayBoard from '../GameObject/Board/DisplayBoard';
import ClientRuntime from '../Runtime/ClientRuntime';
import PlayerInputManager from '../Input/PlayerInputManager';
import Vector2 from '../../../RTChessCore/src/Primitives/Vector2';

export default class MatchScene extends Scene implements WillEnter {
  public board: DisplayBoard | null = null;

  public getBoard(): DisplayBoard {
    if (this.board === null) {
      throw new Error("Attempted to get Board from Match before it was set");
    }

    return this.board;
  }
  public enter(): void {
    const board = new DisplayBoard();
    const boardRect = board.getWorldRect();

    // TODO: "un-register" this when we leave the scene
    ClientRuntime.instance.registerInputManager(new PlayerInputManager());
    this.addChild(board);
    this.board = board;

    board.getPosition().add(new Vector2(
      (ClientRuntime.instance.renderer.getWidth() / 2) - (boardRect.getWidth() / 2),
      (ClientRuntime.instance.renderer.getHeight() / 2) - (boardRect.getHeight() / 2),
    ));
  }

  public getName(): string {
    return 'SCENE_MATCH';
  }

  public update(): boolean {
    return false;
  }
}
