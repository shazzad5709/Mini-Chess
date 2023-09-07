import React from 'react';

const pieceIcons = [
  '♖', '♘', '♗', '♕', '♔', '♙',
  '♙', '♙', '♙', '♙', '♙', '♙',
  '', '', '', '', '', '',
  '♟', '♟', '♟', '♟', '♟', '♟',
  '♜', '♞', '♝', '♛', '♚', '♟',
];



const Chessboard: React.FC = () => {
  return (
    <div className="w-64 grid grid-cols-6 gap-0.5">
      {Array.from({ length: 30 }, (_, index) => (
        <div
          key={index}
          className={`h-16 flex items-center justify-center text-3xl font-bold ${
            index % 2 === Math.floor(index / 6) % 2
              ? 'bg-brown-light text-white'
              : 'bg-brown-dark text-black'
          }`}
        >
          {/* Render your chess pieces here */}
          <span className="text-chess">{pieceIcons[index]}</span>


        </div>
      ))}
    </div>
  );
};

export default Chessboard;
