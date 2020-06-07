import DisplayList from './DisplayList';
import Color from '../../Renderer/Color';
import Match, { MatchState } from '../../../../RTChessCore/src/Match/Match';
import Vector2 from '../../../../RTChessCore/src/Primitives/Vector2';

export default class DisplayMatchList extends DisplayList<Match> {
  protected getItems(): Match[] {
      throw new Error("Method not implemented.");
  }

  protected drawItem(ctx: CanvasRenderingContext2D, match: Match, position: Vector2) {
    switch(match.getState()) {
      case MatchState.READYING:
        ctx.fillStyle = Color.WHITE.toString();
        break;
      case MatchState.LOADING:
        ctx.fillStyle = Color.ORANGE.toString();
        break;
      case MatchState.PLAYING:
        ctx.fillStyle = Color.GREEN.toString();
        break;
      case MatchState.FINALISING:
        ctx.fillStyle = Color.YELLOW.toString();
        break;
    }

    ctx.fillText(
      `${match.getId()} ${(match.getState())}`,
      position.x,
      position.y
    );
  }
}
