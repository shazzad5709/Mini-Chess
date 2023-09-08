// pages/QuickChess.tsx
import React, { useState } from 'react'
import Piece from './Piece'
import { generateLegalMoves } from '@/utils/ChessMoves'

const QuickChess: React.FC = () => {
  const initialBoard: (string | null)[][] = [
    ['rook-black', 'bishop-black', 'queen-black', 'king-black', 'knight-black'],
    ['pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black'],
    [null, null, null, null, null],
    [null, null, null, null, null],
    ['pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white'],
    ['rook-white', 'bishop-white', 'queen-white', 'king-white', 'knight-white'],
  ]

  const [board, setBoard] = useState(initialBoard)
  const [selectedPiecePosition, setSelectedPiecePosition] = useState({
    row: 0,
    col: 0,
  })

  const highlightSelect = 'bg-orange-400'

  // Implement your move logic and AI move calculation

  const handleSquareClick = (row: number, col: number) => {
    const selectedPiece = board[row][col]

    // console.log(selectedPiece)

    if(selectedPiece?.includes('white')) {
      setSelectedPiecePosition({ row, col })
      clearHighlightedSquares()
      highlightSquare(row, col)

      const legalMoves = generateLegalMoves(selectedPiece, board, row, col)
      console.log(legalMoves)
      highlightLegalMoves(legalMoves)

    }    
  }

  const highlightLegalMoves = (legalMoves: number[][]) => {
    legalMoves.forEach(move => {
      const [row, col] = move
      highlightSquare(row, col)
    })
  }

  const highlightSquare = (row: number, col: number) => {
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
  
    if (square) {
      square.classList.add(`${highlightSelect}`);
    }
  }


  const clearHighlightedSquares = () => {
    const squares = document.querySelectorAll('.square')

    squares.forEach(square => {
      square.classList.remove(`${highlightSelect}`)
    })
  }

  const handleAIMove = () => {
    // Calculate and execute the AI's move here
  };

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='bg-[#442922] p-8'>
        {board.map((row, rowIndex) => (
          <div className='flex' key={rowIndex}>
            {row.map((piece, colIndex) => (
              <Piece
                piece={piece}
                row={rowIndex}
                col={colIndex}
                onClick={handleSquareClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuickChess
