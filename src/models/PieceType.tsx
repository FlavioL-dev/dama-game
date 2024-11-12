import WHITE_PAWN_IMAGE from "../assets/White_pawn.png";
import BLACK_PAWN_IMAGE from "../assets/black_pawn.png";
import WHITE_KING_IMAGE from "../assets/white_king.png";
import BLACK_KING_IMAGE from "../assets/black_king.png";

enum PieceType {
  WHITE_KING = "W", // Dama bianca
  WHITE_PAWN = "w", // Pedina bianca
  BLACK_KING = "B", // Dama nera
  BLACK_PAWN = "b", // Pedina nera
  EMPTY = "e", // Cella vuota
}
export default PieceType;

const pieceImages = {
  [PieceType.WHITE_PAWN]: WHITE_PAWN_IMAGE,
  [PieceType.BLACK_PAWN]: BLACK_PAWN_IMAGE,
  [PieceType.WHITE_KING]: WHITE_KING_IMAGE,
  [PieceType.BLACK_KING]: BLACK_KING_IMAGE,
  [PieceType.EMPTY]: null, // Nessuna immagine per celle vuote
};

const getImgPath = (piece: PieceType): string | null => {
  return pieceImages[piece];
};

export { getImgPath };