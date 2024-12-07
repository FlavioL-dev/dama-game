import React from "react";
import PieceType, { getImgPath } from "../models/PieceType";
import Position from "../models/Position";
import ActionType from "../models/ActionType";
import "../MoveFC.css";

interface MoveProps {
  index: number;
  move: {
    actionType: ActionType;
    movedPiece: PieceType;
    from: Position;
    to: Position;
  };
}

/**
 * MoveFC Component - Show a single Move of the game done by a player/bot
 */
const MoveFC: React.FC<MoveProps> = React.memo(({ index, move }) => {
  return (
    <p className="move">
      <strong>{index}: </strong>
      <span>&nbsp;{move.actionType}&nbsp;</span>
      <img
        className="move-item-image"
        src={getImgPath(move.movedPiece)!}
        alt={move.movedPiece}
        style={{ width: "10%", height: "10%" }}
      />
      <span>
        {` (${move.from.row}, ${move.from.col})`} to
        {` (${move.to.row}, ${move.to.col})`}
      </span>
    </p>
  );
});

export default MoveFC;
