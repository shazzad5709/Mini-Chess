import React from 'react';

const pieceIcons = [
  '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖',
  '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '',
  '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
  '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
];

const Chessboard: React.FC = () => {
  return (
    <div className="w-64 grid grid-cols-8 gap-0.5">
      {Array.from({ length: 64 }, (_, index) => (
        <div
          key={index}
          className={`h-16 flex items-center justify-center text-3xl font-bold ${
            index % 2 === Math.floor(index / 8) % 2
              ? 'bg-white text-black'
              : 'bg-gray-600 text-white'
          }`}
        >
          {/* Render your chess pieces here */}
          {pieceIcons[index]}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;
