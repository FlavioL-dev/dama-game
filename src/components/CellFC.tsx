import React from "react";
import CellProp from "../models/CellProp";
import PieceType, { getImgPath } from "../models/PieceType";
import Position from "../models/Position";
import ColorType from "../models/ColorType";
import "../CellFC.css";

const getCellClass = (cell: CellProp): string => {
  if (cell.color === ColorType.HIGHLIGHT) return "cell-highlight";
  if (cell.color === ColorType.SELECTED) return "cell-selected";
  return (cell.position.row + cell.position.col) % 2 === 0
    ? "cell-light"
    : "cell-dark";
};

const areEqual = (prevProps: CellFCProps, nextProps: CellFCProps) => {
  return prevProps.cell.color === nextProps.cell.color 
    && prevProps.cell.piece === nextProps.cell.piece
    && prevProps.cell.position === nextProps.cell.position;
}

interface CellFCProps {
  cell: CellProp;
  onCellClick: (pos: Position) => void;
  onCellHoverStart: (pos: Position) => void;
  onCellHoverEnd: (pos: Position) => void;
}

/**
 * CellFC Component - Single board Cell
 */
const CellFC: React.FC<CellFCProps> = React.memo(
  ({ cell, onCellClick, onCellHoverStart, onCellHoverEnd }) => {

    return (
      <div
        className={`cell ${getCellClass(cell)}`}
        onClick={() => { onCellClick(cell.position); }}
        onMouseEnter={() => { onCellHoverStart(cell.position); }}
        onMouseLeave={() => { onCellHoverEnd(cell.position); }}
      >
        {cell.piece !== PieceType.EMPTY && (
          <img src={getImgPath(cell.piece)!} alt={cell.piece} />
        )}
      </div>
    );
  },
  areEqual
);
export default CellFC;
