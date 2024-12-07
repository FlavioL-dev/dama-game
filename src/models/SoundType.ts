import MOVE_PIECE from "../assets/move_piece.mp3";
import EAT_PIECE from "../assets/eat_piece.mp3";
import UNALLOWED_MOVE from "../assets/unallowed_move.mp3";
import SELECT from "../assets/select.mp3";
import DESELECT from "../assets/deselect.mp3";
import GAME_START from "../assets/game_start.mp3";
import GAME_END from "../assets/game_end.mp3";

export default class SoundType {
  private filePath: string;

  private constructor(filePath: string) {
    this.filePath = filePath;
  }

  static MOVE_PIECE = new SoundType(MOVE_PIECE);
  static EAT_PIECE = new SoundType(EAT_PIECE);
  static UNALLOWED_MOVE = new SoundType(UNALLOWED_MOVE);
  static SELECT = new SoundType(SELECT);
  static DESELECT = new SoundType(DESELECT);
  static GAME_START = new SoundType(GAME_START);
  static GAME_END = new SoundType(GAME_END);

  play() {
    const audio = new Audio(this.filePath);
    audio.play();
  }
}
