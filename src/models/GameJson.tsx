import Board from "../logic/Board";
import CellProp from "./CellProp";
import GameMode from "./GameMode";
import GameProp from "./GameProp";
import Move from "./Move";
import Position from "./Position";

export default interface GameJson {
  readonly uuid: string;
  readonly whitePlayerId: string; // UUID for the white player
  readonly blackPlayerId: string; // UUID for the black player
  readonly winnerId: string | null; // UUID for the black player
  readonly currentTurn: "white" | "black";
  readonly forcedMoveCell: boolean | null; // Optional forced move
  readonly whiteMovesCount: number;
  readonly blackMovesCount: number;
  readonly moveHistory: Move[];
  readonly currentSelected: Position | null;
  readonly mode: GameMode;
  readonly cells: CellProp[];
}

export const fromGame = (game: GameProp): GameJson => {
  const cells: CellProp[] = [];
  const cells2 = game.board.getCells();
  for (let i = 0; i < cells2.length; i++) cells.push(cells2[i].getProp());
  return {
    uuid: game.uuid,
    whitePlayerId: game.whitePlayerId, // UUID for the white player
    blackPlayerId: game.blackPlayerId, // UUID for the black player
    winnerId: game.winnerId, // UUID for the black player
    currentTurn: game.currentTurn,
    whiteMovesCount: game.whiteMovesCount,
    blackMovesCount: game.blackMovesCount,
    moveHistory: game.moveHistory,
    mode: game.mode,
    currentSelected:
      game.currentSelected === undefined ? null : game.currentSelected!,
    forcedMoveCell:
      game.forcedMoveCell === undefined ? null : game.forcedMoveCell!,
    cells: cells,
  };
};

export const toGame = (game: GameJson): GameProp => {
  const board = new Board();
  for (let i = 0; i < game.cells.length; i++) {
    const cell = board.getCell(game.cells[i].position);
    cell.setPiece(game.cells[i].piece);
    cell.setColor(game.cells[i].color);
  }
  return {
    ...game,
    currentSelected:
      game.currentSelected === null ? undefined : game.currentSelected!,
    forcedMoveCell:
      game.forcedMoveCell === null ? undefined : game.forcedMoveCell!,
    board: board,
  };
};
