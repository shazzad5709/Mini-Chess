// components/ChessSquare.tsx
import styles from '@/styles/ChessPiece.module.css';

interface ChessSquareProps {
  piece: string | null;
  onClick: () => void;
}

const ChessSquare: React.FC<ChessSquareProps> = ({ piece, onClick }) => (
  <div className={`square ${piece ? piece : ''}`} onClick={onClick}>
    {piece}
  </div>
);

export default ChessSquare;
