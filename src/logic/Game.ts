import Cell from "./Cell";
import Position, { equalPositions } from "../models/Position";
import GameProp from "../models/GameProp";
import SoundType from "../models/SoundType";
import PieceType from "../models/PieceType";
import ActionType from "../models/ActionType";
import Move from "../models/Move";
import GameMode from "../models/GameMode";

export default class Game {
  private _game: GameProp;
  private onGameChange: (arg0: GameProp) => void;
  private userUid: string;

  constructor(
    game: GameProp,
    userUid: string,
    onGameChange: (arg0: GameProp) => void
  ) {
    this._game = game;
    this.onGameChange = onGameChange;
    this.userUid = userUid;
  }

  getProp(): GameProp {
    return this._game;
  }

  onCellClick(pos: Position): Position[] {
    if (
      this._game.mode === GameMode.ONLINE &&
      ((this._game.currentTurn === "white" &&
        this._game.whitePlayerId !== this.userUid) ||
        (this._game.currentTurn === "black" &&
          this._game.blackPlayerId !== this.userUid))
    )
      return [];

    const cell = this.getCell(pos);
    console.log("OnClick " + pos.row + " " + pos.col + " " + cell.isSelected());
    console.log(this._game);
    let result;
    if (cell.isSelected()) result = this.onSelectedCellClick(cell);
    else result = this.onUnselectedCellClick(cell);

    if (result.length !== 0) this.onGameChange(this.getProp());
    return result;
  }

  private onUnselectedCellClick(cell: Cell): Position[] {
    const pos = cell.getProp().position;
    if (this.hasSelectedPosition()) {
      //esiste già una cella selezionata, guardo se è una mossa possibile
      const selectedPos: Position = this._game.currentSelected!;
      const allowedMoves = this.findAllowedMoves(selectedPos);
      if (!allowedMoves.some((position) => equalPositions(position, pos))) {
        SoundType.UNALLOWED_MOVE.play();
        return [];
      }

      //ho selezionato un movimento possibile
      const positions: Position[] = [];
      for (let i = 0; i < allowedMoves.length; i++) {
        const innerCell = this.getCell(allowedMoves[i]);
        innerCell.resetColor();
        positions.push(innerCell.getProp().position);
      }
      const selectedCell = this.getCell(selectedPos);
      selectedCell.resetColor();
      //this._game = { ...this._game, currentSelected: undefined };
      positions.push(selectedCell.getProp().position);

      //move logic
      positions.push(...this.onMoveCell(this._game.currentSelected!, pos));

      return positions;
    }

    console.log(this._game.currentTurn + " " + cell.getProp().piece);
    if (
      // posso selezionare la casella?
      (!cell.isWhite() && this._game.currentTurn === "white") ||
      (!cell.isBlack() && this._game.currentTurn === "black")
    ) {
      SoundType.UNALLOWED_MOVE.play();
      return [];
    }
    //TODO if forced must eat

    const allowedMoves = this.findAllowedMoves(pos);
    if (allowedMoves.length === 0) {
      //cannot move this piece so don't select
      SoundType.UNALLOWED_MOVE.play();
      return [];
    }
    const positions: Position[] = [];
    cell.select();
    this._game = { ...this._game, currentSelected: pos };
    positions.push(cell.getProp().position);
    for (let i = 0; i < allowedMoves.length; i++) {
      const innerCell = this.getCell(allowedMoves[i]);
      innerCell.highlightColor();
      positions.push(innerCell.getProp().position);
    }
    SoundType.SELECT.play();
    return positions;
  }

  private onSelectedCellClick(cell: Cell): Position[] {
    if (this.getProp().forcedMoveCell) {
      //non puoi deselezionare
      SoundType.UNALLOWED_MOVE.play();
      return [];
    }
    //deseleziona
    const positions: Position[] = [];
    const allowedMoves = this.findAllowedMoves(cell.getProp().position);
    for (let i = 0; i < allowedMoves.length; i++) {
      const innerCell = this.getCell(allowedMoves[i]);
      innerCell.resetColor();
      positions.push(innerCell.getProp().position);
    }
    cell.highlightColor();
    this._game = { ...this._game, currentSelected: undefined };
    positions.push(cell.getProp().position);
    SoundType.DESELECT.play();
    return positions;
  }

  hasSelectedPosition(): boolean {
    return this._game.currentSelected !== undefined;
  }

  onHoverStart(pos: Position): Position[] {
    if (
      this._game.mode === GameMode.ONLINE &&
      ((this._game.currentTurn === "white" &&
        this._game.whitePlayerId !== this.userUid) ||
        (this._game.currentTurn === "black" &&
          this._game.blackPlayerId !== this.userUid))
    )
      return [];

    const cell = this.getCell(pos);
    if (!cell.isUsableTile()) return [];
    if (this.hasSelectedPosition()) return [];
    if (!cell.isWhite() && this._game.currentTurn === "white") return [];
    if (!cell.isBlack() && this._game.currentTurn === "black") return [];
    this.getCell(pos).highlightColor();
    return [pos];
  }

  onHoverEnd(pos: Position): Position[] {
    if (
      this._game.mode === GameMode.ONLINE &&
      ((this._game.currentTurn === "white" &&
        this._game.whitePlayerId !== this.userUid) ||
        (this._game.currentTurn === "black" &&
          this._game.blackPlayerId !== this.userUid))
    )
      return [];

    const cell = this.getCell(pos);
    if (!cell.isUsableTile()) return [];
    if (this.hasSelectedPosition()) return [];
    if (!cell.isWhite() && this._game.currentTurn === "white") return [];
    if (!cell.isBlack() && this._game.currentTurn === "black") return [];
    this.getCell(pos).resetColor();
    return [pos];
  }

  // Method to set a forced move cell
  setForcedCellMove(position: Position) {
    this._game = {
      ...this._game,
      currentSelected: position,
      forcedMoveCell: true,
    };
  }

  // Method to clear forced move
  clearForcedMove() {
    this._game = { ...this._game, forcedMoveCell: undefined };
  }

  findAllowedMoves(pos: Position): Position[] {
    let cell = this.getCell(pos);
    let allowedMoves: Position[] = [];
    if (cell.isEmpty()) return allowedMoves;
    if (cell.isBlack() || cell.isKing()) {
      let targetPos = this.getMovePositionIfAllowed(cell, -1, -1);
      if (targetPos !== undefined) allowedMoves.push(targetPos);
      targetPos = this.getMovePositionIfAllowed(cell, -1, +1);
      if (targetPos !== undefined) allowedMoves.push(targetPos);
    }
    if (cell.isWhite() || cell.isKing()) {
      let targetPos = this.getMovePositionIfAllowed(cell, +1, -1);
      if (targetPos !== undefined) allowedMoves.push(targetPos);
      targetPos = this.getMovePositionIfAllowed(cell, +1, +1);
      if (targetPos !== undefined) allowedMoves.push(targetPos);
    }
    return allowedMoves;
  }
  findAllowedEat(pos: Position): Position[] {
    return this.findAllowedMoves(pos).filter(
      (position) => Math.abs(position.row - pos.row) === 2
    );
  }

  private getMovePositionIfAllowed(
    cell: Cell,
    rowDir: number,
    colDir: number
  ): Position | undefined {
    let pos = cell.getProp().position;
    let targetPos: Position = { row: pos.row + rowDir, col: pos.col + colDir };
    if (this._game.board.isInside(targetPos)) {
      let target = this.getCell(targetPos);
      if (target.isEmpty()) {
        //libero
        return targetPos;
      } else if (target.isBlack() !== cell.isBlack()) {
        //posso mangiare
        let targetPos = {
          row: pos.row + rowDir * 2,
          col: pos.col + colDir * 2,
        };
        if (
          this._game.board.isInside(targetPos) &&
          this.getCell(targetPos).isEmpty()
        ) {
          return targetPos;
        }
      }
    }
    return undefined;
  }
  private onMoveCell(from: Position, to: Position): Position[] {
    const positions: Position[] = [];
    const fromCell = this.getCell(from);
    const toCell = this.getCell(to);
    const isEating = Math.abs(from.row - to.row) === 2;

    //piece movement logic
    let type: PieceType = fromCell.getProp().piece;
    if (fromCell.isWhite() && to.row === 7) {
      type = PieceType.WHITE_KING;
    } else if (fromCell.isBlack() && to.row === 0) {
      type = PieceType.BLACK_KING;
    }
    toCell.setPiece(type);
    fromCell.setPiece(PieceType.EMPTY);

    //eating logic
    if (isEating) {
      const eaten = {
        row: (from.row + to.row) / 2,
        col: (from.col + to.col) / 2,
      };
      const eatenCell = this.getCell(eaten);
      eatenCell.setPiece(PieceType.EMPTY);
      positions.push(eaten);
      SoundType.EAT_PIECE.play();

      //can eat again?
      const allowedEat = this.findAllowedEat(to);
      if (allowedEat.length !== 0) {
        this._game = {
          ...this._game,
          whiteMovesCount:
            this._game.whiteMovesCount +
            (this._game.currentTurn === "white" ? 1 : 0),
          blackMovesCount:
            this._game.whiteMovesCount +
            (this._game.currentTurn === "black" ? 1 : 0),
          currentSelected: to,
          forcedMoveCell: true,
        };
        toCell.select();
        for (let i = 0; i < allowedEat.length; i++) {
          const eatableCell = this.getCell(allowedEat[i]);
          eatableCell.highlightColor();
          positions.push(allowedEat[i]);
        }
      } else {
        this._game = {
          ...this._game,
          whiteMovesCount:
            this._game.whiteMovesCount +
            (this._game.currentTurn === "white" ? 1 : 0),
          blackMovesCount:
            this._game.blackMovesCount +
            (this._game.currentTurn === "black" ? 1 : 0),
          currentTurn: this._game.currentTurn === "white" ? "black" : "white",
          currentSelected: undefined,
          forcedMoveCell: undefined,
        };
      }
    } else {
      this._game = {
        ...this._game,
        whiteMovesCount:
          this._game.whiteMovesCount +
          (this._game.currentTurn === "white" ? 1 : 0),
        blackMovesCount:
          this._game.blackMovesCount +
          (this._game.currentTurn === "black" ? 1 : 0),
        currentTurn: this._game.currentTurn === "white" ? "black" : "white",
        currentSelected: undefined,
        forcedMoveCell: undefined,
      };
      SoundType.MOVE_PIECE.play();
    }
    const move: Move = {
      from: from,
      to: to,
      movedPiece: type,
      actionType: isEating ? ActionType.CAPTURE : ActionType.MOVE,
    };
    this._game.moveHistory.push(move);
    //did game end?
    if (this.isEnded()) {
      this._game = {
        ...this._game,
        winnerId:
          this._game.currentTurn === "white"
            ? this._game.blackPlayerId
            : this._game.whitePlayerId,
        currentSelected: undefined,
        forcedMoveCell: undefined,
      };
      alert("Partita conclusa");
      return positions;
    }
    if (this.isDraw()) {
      this._game = {
        ...this._game,
        winnerId: "none",
        currentSelected: undefined,
        forcedMoveCell: undefined,
      };
      alert("Partita conclusa");
      return positions;
    }

    switch (this._game.mode) {
      case GameMode.LOCAL:
        {
          //bot logic
          if (
            this._game.currentTurn === "white" &&
            this._game.whitePlayerId === "bot"
          ) {
            let found = false;
            for (let row = 0; row < 8; row++) {
              for (let col = 0; col < 8; col++) {
                const cell = this._game.board.getCell({ row, col });
                if (cell.isWhite()) {
                  const targets = this.findAllowedMoves(
                    cell.getProp().position
                  );
                  if (targets.length != 0) {
                    found = true;
                    positions.push(...this.onUnselectedCellClick(cell));
                    positions.push(
                      ...this.onUnselectedCellClick(
                        this._game.board.getCell(targets[0])
                      )
                    );
                    break;
                  }
                }
              }
              if (found) break;
            }
          } else if (
            this._game.currentTurn === "black" &&
            this._game.blackPlayerId === "bot"
          ) {
            let found = false;
            for (let row = 0; row < 8; row++) {
              for (let col = 0; col < 8; col++) {
                const cell = this._game.board.getCell({ row, col });
                if (cell.isBlack()) {
                  const targets = this.findAllowedMoves(
                    cell.getProp().position
                  );
                  if (targets.length != 0) {
                    found = true;
                    positions.push(...this.onUnselectedCellClick(cell));
                    positions.push(
                      ...this.onUnselectedCellClick(
                        this._game.board.getCell(targets[0])
                      )
                    );
                    break;
                  }
                }
              }
              if (found) break;
            }
          }
        }
        break;
      case GameMode.ONLINE: {
        break;
      }
    }

    return positions;
  }
  private isDraw(): boolean {
    const turn = this._game.currentTurn;
    return !this._game.board
      .getCells()
      .some(
        (cell) =>
          (turn === "black" ? cell.isBlack() : cell.isWhite()) &&
          this.findAllowedMoves(cell.getProp().position).length !== 0
      );
  }

  private isEnded(): boolean {
    return !(
      this._game.board.getCells().some((cell) => cell.isBlack()) &&
      this._game.board.getCells().some((cell) => cell.isWhite())
    );
  }

  public isConcluded(): boolean {
    return this._game.winnerId !== null;
  }

  getCell(pos: Position): Cell {
    return this._game.board.getCell(pos);
  }
}
