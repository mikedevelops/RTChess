import Piece from './Piece';
import Vector2 from '../Primitives/Vector2';
import Pawn from './Pawn';
import SerialisedPiece from './SerialisedPiece';

export default class Board {
  public static SERIALIZED_LENGTH: number = 3;
  public static SERIALIZED_ID: number = 0;
  public static SERIALIZED_POSITION_X: number = 1;
  public static SERIALIZED_POSITION_Y: number = 2;

  private pieces: Map<Vector2, Piece> = new Map();
  private width: number = 4;
  private height: number = 4;

  public start(): void {
    for (let i = 0; i < 4; i++) {
      const pawn = new Pawn(this.pieces.size, new Vector2(i, 0));
      this.pieces.set(pawn.getPosition(), pawn);
    }
  }

  private addPiece(piece: Piece, position: Vector2): void {
    this.pieces.set(position, piece);
  }

  public serialise(): SerialisedPiece[] {
    const pieces: SerialisedPiece[] = []

    for (const piece of this.pieces.values()) {
      pieces.push(piece.serialise());
    }

    return pieces;
  }
}
