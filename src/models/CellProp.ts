import ColorType from "./ColorType";
import PieceType from "./PieceType";
import Position from "./Position";

export default interface CellProp {
  readonly position: Position;
  readonly color: ColorType;
  readonly piece: PieceType;
}
