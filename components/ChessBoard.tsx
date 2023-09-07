// components/Chessboard.tsx

import React from 'react';
import styles from './Chessboard.module.css';

const Chessboard: React.FC = () => {
  const boardSize = 400; // Adjust the size as needed

  const squares = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isDark = (row + col) % 2 === 1;
      squares.push(
        <div
          className={`${styles.square} ${isDark ? styles.dark : styles.light}`}
          key={`${row}-${col}`}
        ></div>
      );
    }
  }

  return (
    <div className={styles.chessboard} style={{ width: `${boardSize}px`, height: `${boardSize}px` }}>
      {squares}
    </div>
  );
};

export default Chessboard;
