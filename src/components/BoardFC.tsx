import React, { useState } from "react";
import Board from "../logic/Board";
import CellFC from "./CellFC";
import Position, { getPosKeyFromPos } from "../models/Position";
import "../BoardFC.css";

interface BoardFCProps {
  key: string;
  board: Board;
  onCellClick: (pos: Position) => Position[];
  onCellHoverStart: (pos: Position) => Position[];
  onCellHoverEnd: (pos: Position) => Position[];
}

/**
 * BoardFC Component - Contains the Cell grid
 */
const BoardFC: React.FC<BoardFCProps> = ({
  board,
  onCellClick,
  onCellHoverStart,
  onCellHoverEnd,
}) => {
  const [_, setCounter] = useState(0);

  const update = (
    pos: Position,
    func: (arg1: Position) => Position[]
  ): Position[] => {
    let res = func(pos);
    if (res.length > 0) {
      setCounter((prevCounter)=>prevCounter + 1);
    }
    
    //debug
    res.forEach((position) => console.log("Updated cell " + getPosKeyFromPos(position)));

    return res;
  };

  return (
    <div className="board">
      {Array.from({ length: 8 }).map((_, row) => (
        <div key={row} className="board-row">
          {Array.from({ length: 8 }).map((_, col) => {
            const pos = { row, col };
            const cell = board.getCell(pos);
            return (
              <CellFC
                key={cell.getKey()}
                cell={cell.getProp()}
                onCellClick={(pos) => update(pos, onCellClick)}
                onCellHoverStart={(pos) => update(pos, onCellHoverStart)}
                onCellHoverEnd={(pos) => update(pos, onCellHoverEnd)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default BoardFC;
