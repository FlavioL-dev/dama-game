import CellProp from "../models/CellProp";
import ColorType from "../models/ColorType";
import PieceType from "../models/PieceType";

export default class Cell {
  setColor(color: ColorType) {
    this._prop = { ...this._prop, color: color };
  }
  setPiece(piece: PieceType) {
    this._prop = { ...this._prop, piece: piece };
  }
  isDefaultColor(): boolean {
    return this._prop.color === ColorType.DEFAULT;
  }
  
  private _prop: CellProp;

  constructor(cellProp: CellProp) {
    this._prop = cellProp;
  }

  isSelected(): boolean {
    return this._prop.color === ColorType.SELECTED;
  }

  /**
   * @returns true se la cella è vuota
   */
  isEmpty(): boolean {
    return this._prop.piece === PieceType.EMPTY;
  }

  /**
   * @returns true se la cella è una dama
   */
  isKing(): boolean {
    return (
      this._prop.piece === PieceType.WHITE_KING ||
      this._prop.piece === PieceType.BLACK_KING
    );
  }

  /**
   * @returns true se la cella è bianca
   */
  isUsableTile(): boolean {
    return (this._prop.position.row + this._prop.position.col) % 2 !== 0;
  }

  /**
   * @returns true se la cella ospita un pezzo bianco
   */
  isWhite(): boolean {
    return (
      this._prop.piece === PieceType.WHITE_KING ||
      this._prop.piece === PieceType.WHITE_PAWN
    );
  }

  /**
   * @returns true se la cella ospita un pezzo nero
   */
  isBlack(): boolean {
    return (
      this._prop.piece === PieceType.BLACK_KING ||
      this._prop.piece === PieceType.BLACK_PAWN
    );
  }

  /**
   * Resetta il colore a default
   */
  resetColor(): void {
    this._prop = { ...this._prop, color: ColorType.DEFAULT };
  }

  /**
   * Evidenzia il colore della cella
   */
  highlightColor(): void {
    this._prop = { ...this._prop, color: ColorType.HIGHLIGHT };
  }

  /**
   * Select, change color
   */
  select(): void {
    this._prop = { ...this._prop, color: ColorType.SELECTED };
  }

  getKey(): string {
    return `${this._prop.position.col}_${this._prop.position.row}`;
  }
  getIndex(): string {
    return `${this._prop.position.col}_${this._prop.position.row}`;
  }

  getProp(): CellProp {
    return this._prop;
  }
}
