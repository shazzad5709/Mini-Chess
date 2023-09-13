import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChessKing,
  faChessPawn,
  faChessKnight,
  faChessRook,
  faChessQueen,
  faChessBishop
} from '@fortawesome/free-solid-svg-icons';
import {
  faChessKing as faWhiteKing,
  faChessPawn as faWhitePawn,
  faChessKnight as faWhiteKnight,
  faChessRook as faWhiteRook,
  faChessQueen as faWhiteQueen,
  faChessBishop as faWhiteBishop
} from '@fortawesome/free-regular-svg-icons';
import Image from 'next/image';

type Props = {
  piece: string | null;
  row: number;
  col: number;
  onClick: (row: number, col: number) => void;
}

export default function Piece({ piece, row, col, onClick }: Props) {
  // use unicode characters to render the pieces
  const getPiece = (piece: string | null) => {
    switch (piece) {
      case 'bR':
        return 'rook-black'
      case 'bN':
        return 'knight-black'
      case 'bB':
        return 'bishop-black'
      case 'bQ':
        return 'queen-black';
      case 'bK':
        return 'king-black'
      case 'bp':
        return 'pawn-black'
      case 'wR':
        return 'rook-white'
      case 'wN':
        return 'knight-white'
      case 'wB':
        return 'bishop-white'
      case 'wQ':
        return 'queen-white'
      case 'wK':
        return 'king-white'
      case 'wp':
        return 'pawn-white'
      default:
        return null;
    }
  }

  return (
    // render the squares
    <div data-row={row} data-col={col}
      className={`square h-32 w-32 text-6xl flex items-center justify-center outline outline-[rgb(68,41,34)] ${(row + col) % 2 === 0 ? 'bg-[#a17a64]' : 'bg-[#ddcfb8]'
        }`}
      onClick={() => onClick(row, col)}
    >
      {(piece!=='--') && <Image src={`/${getPiece(piece)}.png`} alt={''} width={64} height={64} />}
    </div>
  )
}