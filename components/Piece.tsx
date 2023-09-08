import { TbChessBishop, TbChessBishopFilled, TbChessKing, TbChessKingFilled, TbChessKnight, TbChessKnightFilled, TbChessQueen, TbChessQueenFilled, TbChessRook, TbChessRookFilled } from 'react-icons/tb';
import { GiChessPawn } from 'react-icons/gi';
import { LiaChessPawnSolid } from 'react-icons/lia';
type Props = {
  piece : string | null;
  row : number;
  col : number;
  onClick : (row: number, col: number) => void;
}

export default function Piece({ piece, row, col, onClick }: Props) {
  // use unicode characters to render the pieces
  const getPiece = (piece: string | null) => {
    switch (piece) {
      case 'rook-black':
        return <TbChessRookFilled />;
      case 'knight-black':
        return <TbChessKnightFilled />;
      case 'bishop-black':
        return <TbChessBishopFilled />;
      case 'queen-black':
        return <TbChessQueenFilled />;
      case 'king-black':
        return <TbChessKingFilled />;
      case 'pawn-black':
        return <GiChessPawn />;
      case 'rook-white':
        return <TbChessRook />;
      case 'knight-white':
        return <TbChessKnight />;
      case 'bishop-white':
        return <TbChessBishop />;
      case 'queen-white':
        return <TbChessQueen />;
      case 'king-white':
        return <TbChessKing />;
      case 'pawn-white':
        return <LiaChessPawnSolid />;
      default:
        return null;
    }
  }
    
  return (
    // render the squares
    <div data-row={row} data-col={col}
      className={`square h-32 w-32 text-6xl flex items-center justify-center outline outline-[#442922] ${
        (row + col) % 2 === 0 ? 'bg-[#705546]' : 'bg-[#f2dbb5]'
      }`}
      onClick={() => onClick(row, col)}
    >
      {getPiece(piece)}
    </div>
  )
}