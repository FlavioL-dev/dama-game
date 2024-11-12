import Board from "../logic/Board";
import GameMode from "./GameMode";
import Move from "./Move";
import Position from "./Position";

export default interface GameProp {
  readonly uuid: string;
  readonly whitePlayerId: string; // UUID for the white player
  readonly blackPlayerId: string; // UUID for the black player
  readonly winnerId: string | null; // UUID for the black player
  readonly currentTurn: "white" | "black";
  readonly forcedMoveCell?:  boolean; // Optional forced move
  readonly board: Board;
  readonly whiteMovesCount: number;
  readonly blackMovesCount: number;
  readonly moveHistory: Move[];
  readonly currentSelected?: Position;
  readonly mode: GameMode;
}