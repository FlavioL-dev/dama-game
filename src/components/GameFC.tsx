import React, { useEffect, useState } from "react";
import BoardFC from "./BoardFC";
import Game from "../logic/Game";
import Position from "../models/Position";
import { getImgPath } from "../models/PieceType";

interface GameFCProps {
  game: Game;
}

const GameFC: React.FC<GameFCProps> = ({ game }) => {
  const [currentTurn, setCurrentTurn] = useState(game.getProp().currentTurn);
  const [whiteMovesCount, setWhiteMovesCount] = useState(
    game.getProp().whiteMovesCount
  );
  const [blackMovesCount, setBlackMovesCount] = useState(
    game.getProp().blackMovesCount
  );
  const [moves, setMoves] = useState(game.getProp().moveHistory);

  useEffect(() => {
    const updateGameState = () => {
      setCurrentTurn(game.getProp().currentTurn);
      setWhiteMovesCount(game.getProp().whiteMovesCount);
      setBlackMovesCount(game.getProp().blackMovesCount);
      setMoves(game.getProp().moveHistory);
    };
    updateGameState();

    return () => {};
  }, [game]);

  // Handle cell click
  const handleCellClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pos: Position
  ): Position[] => {
    console.log(`CellFC onCellClick at position: ${pos.row}, ${pos.col}`);
    const result = game.onCellClick(pos);
    if (result.length !== 0) {
      setCurrentTurn(game.getProp().currentTurn);
      setWhiteMovesCount(game.getProp().whiteMovesCount);
      setBlackMovesCount(game.getProp().blackMovesCount);
      setMoves(game.getProp().moveHistory);
    }
    return result;
  };

  // Handle hover start event
  const handleCellHoverStart = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pos: Position
  ): Position[] => {
    console.log(`CellFC onHoverStart at position: ${pos.row}, ${pos.col}`);
    return game.onHoverStart(pos);
  };

  // Handle hover end event
  const handleCellHoverEnd = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    pos: Position
  ): Position[] => {
    console.log(`CellFC onHoverEnd at position: ${pos.row}, ${pos.col}`);
    return game.onHoverEnd(pos);
  };

  return (
    <>
      <table id="mainTable">
        <tbody>
          <tr>
            <td height="30%" width="70%">
              <h1>Current Turn: {currentTurn}</h1>
              <h2>White Moves: {whiteMovesCount}</h2>
              <h2>Black Moves: {blackMovesCount}</h2>
            </td>
            <td className="left-bar" height="30%" width="30%">
              <h1>Moves</h1>
            </td>
          </tr>
          <tr>
            <td id="boardTableCell" height="70%" width="70%">
              <BoardFC
                key={"board"}
                board={game.getProp().board}
                onCellClick={handleCellClick}
                onCellHoverStart={handleCellHoverStart}
                onCellHoverEnd={handleCellHoverEnd}
              />
            </td>
            <td className="left-bar" height="70%" width="30%">
              <div className="move-list">
                {moves
                  .slice()
                  .reverse()
                  .map((move, index) => (
                    <p>
                      <strong>{moves.length - index}: </strong>
                      <span>{move.actionType} </span>

                      <img
                        className="move-item-image"
                        src={getImgPath(move.movedPiece)!}
                        alt={move.movedPiece}
                        style={{ width: "10%", height: "10%" }}
                      />

                      <span>
                        {`(${move.from.row}, ${move.from.col})`} to
                        {` (${move.to.row}, ${move.to.col})`}
                      </span>
                    </p>
                  ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default GameFC;
