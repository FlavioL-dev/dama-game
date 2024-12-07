import Cell from "./Cell";
import PieceType from "../models/PieceType";
import Position, {
  getPosKeyFromCoord,
  getPosKeyFromPos,
} from "../models/Position";
import ColorType from "../models/ColorType";

export default class Board {
  private cells: Map<string, Cell>; // Mappa delle celle

  constructor() {
    this.cells = new Map<string, Cell>();
    this.initializeBoard(); // Inizializza la board
  }

  // Metodo per inizializzare la board con le celle e i pezzi
  private initializeBoard(): void {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const isDark = (row + col) % 2 !== 0; // Colore della cella
        // Imposta i pezzi in base alla posizione iniziale
        let piece: PieceType = PieceType.EMPTY;
        if (isDark && row < 3) piece = PieceType.WHITE_PAWN; // Pedine nere
        if (isDark && row > 4) piece = PieceType.BLACK_PAWN; // Pedine bianche

        let position = { row, col };

        const cell: Cell = new Cell({
          position,
          piece,
          color: ColorType.DEFAULT,
        });
        this.cells.set(getPosKeyFromCoord(row, col), cell); // Aggiungi la cella alla mappa
      }
    }
    console.log("inizialized board");
  }

  // Metodo per ottenere una cella data una riga e colonna
  getCell(pos: Position): Cell {
    if (!this.isInside(pos)) {
      throw new Error(
        `Invalid cell coordinates: row ${pos.row}, col ${pos.col}. Must be between 0 and 7.`
      );
    }
    return this.cells.get(getPosKeyFromPos(pos)) as Cell;
  }

  getCells(): Cell[] {
    const array = Array(64);
    for (let i = 0; i < 64; i++) {
      array[i] = this.getCell({ row: Math.floor(i / 8), col: i % 8 });
    }
    return array;
  }

  isInside(position: Position): boolean {
    return !(
      position.row < 0 ||
      position.row >= 8 ||
      position.col < 0 ||
      position.col >= 8
    );
  }

  // Stampa la board (debug)
  printBoard(): void {
    for (let row = 0; row < 8; row++) {
      let rowStr = "";
      for (let col = 0; col < 8; col++) {
        const cell = this.getCell({ row, col });
        rowStr += cell.getProp().piece + " ";
      }
      console.log(rowStr);
    }
  }
}
