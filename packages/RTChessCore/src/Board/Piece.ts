import Vector2 from '../Primitives/Vector2';
import SerialisedPiece from './SerialisedPiece';

export default abstract class Piece {
  constructor(
    private id: string,
    private position: Vector2
  ) {}

  public getId(): string {
    return this.id;
  }

  public getPosition(): Vector2 {
    return this.position;
  }

  public serialise(): SerialisedPiece {
    return {
      id: this.getId(),
      position: this.getPosition().serialise(),
    };
  }
}
