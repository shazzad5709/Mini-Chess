// components/ChessPiece.tsx

import React from 'react';
import { useDrag } from 'react-dnd';

const ChessPiece: React.FC<{ pieceType: string }> = ({ pieceType }) => {
  const [{ isDragging }, ref] = useDrag({
    type: 'CHESS_PIECE',
    item: { pieceType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={ref}
      className={`w-12 h-12 flex justify-center items-center ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ cursor: 'pointer' }}
    >
      {/* Customize your chess piece icons */}
      {pieceType}
    </div>
  );
};

export default ChessPiece;
