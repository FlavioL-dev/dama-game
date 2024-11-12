export default interface Position {
  readonly row: number;
  readonly col: number;  
}

export const getPosBoardIndex = (pos: Position): number => {
  return pos.row * 8 + pos.col;
};

export const getPosKeyFromPos = (pos: Position): string => {
  return `${pos.row}_${pos.col}`;
};

export const getPosKeyFromCoord = (row: number, col: number): string => {
  return `${row}_${col}`;
};

export const equalPositions = (pos1: Position, pos2: Position): boolean => {
  return pos1.col === pos2.col && pos1.row === pos2.row;
};
