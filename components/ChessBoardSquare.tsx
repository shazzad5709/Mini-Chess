// components/ChessboardSquare.tsx

import React, { ReactNode } from 'react';
import { useDrop } from 'react-dnd';

interface ChessboardSquareProps {
  row: number;
  col: number;
  onDrop: (pieceType: string, row: number, col: number) => void;
  children?: ReactNode; // Add children prop to accept child elements
}

const ChessboardSquare: React.FC<ChessboardSquareProps> = ({ row, col, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'CHESS_PIECE',
    drop: (item: { pieceType: string }) => {
      onDrop(item.pieceType, row, col);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`w-12 h-12 flex justify-center items-center ${
        (row + col) % 2 === 1 ? 'bg-gray-700' : 'bg-gray-300'
      } ${isOver ? 'bg-green-300' : ''}`}
    >
      {children}
    </div>
  );
};

export default ChessboardSquare;
