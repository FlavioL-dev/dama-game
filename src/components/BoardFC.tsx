import React, { useState } from "react";
import Board from "../logic/Board";
import CellFC from "./CellFC";
import Position, { getPosKeyFromPos } from "../models/Position";

interface BoardFCProps {
  key: string;
  board: Board;
  onCellClick: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pos: Position
  ) => Position[];
  onCellHoverStart: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pos: Position
  ) => Position[];
  onCellHoverEnd: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pos: Position
  ) => Position[];
}

const BoardFC: React.FC<BoardFCProps> = ({
  board,
  onCellClick,
  onCellHoverStart,
  onCellHoverEnd,
}) => {
  const [counter, setCounter] = useState(0);

  const update = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pos: Position,
    func: (
      arg0: React.MouseEvent<HTMLDivElement, MouseEvent>,
      arg1: Position
    ) => Position[]
  ): Position[] => {
    let res = func(e, pos);
    if (res.length > 0) {
      setCounter(counter + 1);
    }
    for (let i = 0; i < res.length; i++)
      console.log("changed " + getPosKeyFromPos(res[i]));
    return res;
  };

  return (
    <div className="board">
      {[...Array(8)].map((_, row) => (
        <div key={row} className="board-row">
          {[...Array(8)].map((_, col) => {
            const pos = { row, col };
            const cell = board.getCell(pos);
            return (
              <CellFC
                key={cell.getKey()}
                cell={cell.getProp()}
                onCellClick={(e, pos) => update(e, pos, onCellClick)}
                onCellHoverStart={(e, pos) => update(e, pos, onCellHoverStart)}
                onCellHoverEnd={(e, pos) => update(e, pos, onCellHoverEnd)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default BoardFC;
