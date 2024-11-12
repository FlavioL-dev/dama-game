import React, { useEffect } from "react";
import CellProp from "../models/CellProp";
import PieceType, { getImgPath } from "../models/PieceType";
import Position from "../models/Position";
import ColorType from "../models/ColorType";

const areEqual = (prevProps: CellFCProps, nextProps: CellFCProps) => {
  return prevProps.cell === nextProps.cell;
};

interface CellFCProps {
  cell: CellProp;
  onCellClick: (pos: Position) => void;
  onCellHoverStart: (pos: Position) => void;
  onCellHoverEnd: (pos: Position) => void;
}

const CellFC: React.FC<CellFCProps> = React.memo(
  ({ cell, onCellClick, onCellHoverStart, onCellHoverEnd }) => {
    const getColor = (): string => {
      return cell.color == ColorType.HIGHLIGHT
        ? "#ffe81c"
        : cell.color == ColorType.SELECTED
        ? "#00ff00"
        : (cell.position.row + cell.position.col) % 2 === 0
        ? "#EEEED2"
        : "#bf8040";
    };

    // Determina lo stile in base al colore della cella
    const cellStyle = {
      backgroundColor: getColor(),
      width: "50px",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    };
    useEffect(() => {
      //console.log(`CellFC re-rendered for cell at position: ${cell.position.row}, ${cell.position.col}`);
    }, [cell]);

    return (
      <div
        style={cellStyle}
        onClick={() => {
          onCellClick(cell.position);
        }}
        onMouseEnter={() => {
          onCellHoverStart(cell.position);
        }}
        onMouseLeave={() => {
          onCellHoverEnd(cell.position);
        }}
      >
        {cell.piece !== PieceType.EMPTY && (
          <img
            src={getImgPath(cell.piece)!}
            alt={cell.piece}
            style={{ width: "80%", height: "80%" }}
          />
        )}
      </div>
    );
  },
  areEqual
);
export default CellFC;
