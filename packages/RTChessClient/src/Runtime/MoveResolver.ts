import { Vector2 } from "rtchess-core";
import Piece from "../GameObject/Piece/Piece";
import Pawn from "../GameObject/Piece/Pawn";
import ClientRuntime from "./ClientRuntime";

import { PieceType } from "../GameObject/Piece/Piece";

export default class MoveResolver {
  // TODO: BIG TODO!
  // - Cache available moves when we can!
  public getAvailableMoves(piece: Piece): Vector2[] {
    const position = piece.getCoords();

    switch(piece.getType()) {
      case PieceType.PAWN:
        return this.getAvailableMovesForPawn(piece as Pawn);
    }

    return [];
  }

  private getAvailableMovesForPawn(piece: Pawn): Vector2[] {
    const board = ClientRuntime.instance.getBoard();
    const position = piece.getCoords();
    const opponentPiece = piece.isOpponentPiece();
    const moves = [];

    const north = opponentPiece ?
      position.clone().add(new Vector2(0, -1)) :
      position.clone().add(new Vector2(0, 1));
    const northEast = opponentPiece ?
      position.clone().add(new Vector2(-1, -1)) :
      position.clone().add(new Vector2(1, 1));
    const northWest = opponentPiece ?
      position.clone().add(new Vector2(1, -1)) :
      position.clone().add(new Vector2(-1, 1));

    const northEastTile = board.getTileAt(northEast);
    const northTile = board.getTileAt(north);
    const northWestTile = board.getTileAt(northWest);

    if (northTile !== null && !northTile.hasPiece()) {
      moves.push(north);

      const northNorth = opponentPiece ?
        north.clone().add(new Vector2(0, -1)) :
        north.clone().add(new Vector2(0, 1));
      const northNorthTile = board.getTileAt(northNorth);

      if (northNorthTile !== null && !piece.hasMoved() && !northNorthTile.hasPiece()) {
        moves.push(northNorth);
      }
    }

    if (northEastTile !== null) {
      const pieceToTake = northEastTile.getPiece();

      if (pieceToTake !== null && !pieceToTake.isSameSet(piece)) {
        moves.push(northEast);
      }
    }

    if (northWestTile !== null) {
      const pieceToTake = northWestTile.getPiece();

      if (pieceToTake !== null && !pieceToTake.isSameSet(piece)) {
        moves.push(northWest);
      }
    }

    return moves;
  }
}

