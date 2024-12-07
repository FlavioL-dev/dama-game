import Position from "./Position";
import PieceType from "./PieceType";
import ActionType from "./ActionType";

export default interface Move {
  from: Position;
  to: Position;
  movedPiece: PieceType;
  actionType: ActionType;
}
