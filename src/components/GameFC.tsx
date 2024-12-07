import React, { useCallback, useEffect, useState } from "react";
import BoardFC from "./BoardFC";
import Game from "../logic/Game";
import Position from "../models/Position";
import MoveFC from "./MoveFC";
import "../GameFC.css";

interface GameFCProps {
  game: Game;
}

/**
 * GameFC Component - Game menu, includes Board and right side bar of moves
 * this is displayed when a game is going on
 */
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
  const handleCellClick = useCallback((
    pos: Position
  ): Position[] => {
    //debug
    console.log(`CellFC onCellClick at position: ${pos.row}, ${pos.col}`);
    const result = game.onCellClick(pos);
    if (result.length !== 0) {
      setCurrentTurn(game.getProp().currentTurn);
      setWhiteMovesCount(game.getProp().whiteMovesCount);
      setBlackMovesCount(game.getProp().blackMovesCount);
      setMoves(game.getProp().moveHistory);
    }
    return result;
  }, [game]);

  // Handle hover start event
  const handleCellHoverStart = useCallback((pos: Position): Position[] => {
    return game.onHoverStart(pos);
  }, [game]);

  // Handle hover end event
  const handleCellHoverEnd = useCallback((pos: Position): Position[] => {
    return game.onHoverEnd(pos);
  }, [game]);

  return (
    <>
      <table className="game-table">
        <tbody>


          <tr>
            <td className="game-table-row-one game-table-col-one">
              <h1>Current Turn: {currentTurn}</h1>
              <h2>White Moves: {whiteMovesCount}</h2>
              <h2>Black Moves: {blackMovesCount}</h2>
            </td>
            <td className="game-table-row-one game-table-col-two">
              <h1>Moves</h1>
            </td>
          </tr>


          <tr>
            <td className="board-table game-table-row-two game-table-col-one">
              <BoardFC
                key={"board"}
                board={game.getProp().board}
                onCellClick={handleCellClick}
                onCellHoverStart={handleCellHoverStart}
                onCellHoverEnd={handleCellHoverEnd}
              />
            </td>
            <td className="game-table-row-two game-table-col-two" >
              <div className="move-list">
                {moves
                  .slice()
                  .reverse()
                  .map((move, index) => (
                    <MoveFC key={`move-${moves.length-index}`} index={moves.length-index} move={move}/>
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
