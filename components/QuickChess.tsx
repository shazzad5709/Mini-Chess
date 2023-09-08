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
  const highlightMove = 'bg-green-400'
  const [legalMoves, setLegalMoves] = useState<number[][]>([])

  const handleSquareClick = (row: number, col: number) => {
    const selectedPiece = board[row][col]

    if (selectedPiece?.includes('white')) {
      setSelectedPiecePosition({ row, col })
      clearHighlightedSquares()
      highlightSquare(row, col)

      const legalMoves = generateLegalMoves(selectedPiece, board, row, col)
      setLegalMoves(legalMoves)
      highlightLegalMoves(legalMoves)
    } 
    else if ((selectedPiece === null && selectedPiecePosition !== null) || (selectedPiece?.includes('black'))) {
      if (isLegalMove(row, col, legalMoves)) {
        const updatedBoard = makeUserMove(board, selectedPiecePosition, row, col)
        clearHighlightedSquares()
        clearHighlightedMove()
        highlightLastMove(selectedPiecePosition, row, col)
        setBoard(updatedBoard)
        handleAIMove()
      }
    }
  }

  const isLegalMove = (row: number, col: number, legalMoves: number[][]) => {
    return legalMoves.some(move => {
      const [legalRow, legalCol] = move
      return legalRow === row && legalCol === col
    })
  }

  const makeUserMove = (board: (string | null)[][], selectedPiecePosition: { row: number; col: number }, row: number, col: number) => {
    const updatedBoard = [...board]
    const [selectedRow, selectedCol] = [selectedPiecePosition.row, selectedPiecePosition.col]
    const selectedPiece = updatedBoard[selectedRow][selectedCol]
    updatedBoard[selectedRow][selectedCol] = null
    updatedBoard[row][col] = selectedPiece
    return updatedBoard
  }

  const highlightLastMove = (selectedPiecePosition: { row: number; col: number }, row: number, col: number) => {
    const newSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    const oldSquare = document.querySelector(`.square[data-row="${selectedPiecePosition.row}"][data-col="${selectedPiecePosition.col}"]`);

    if (oldSquare && newSquare) {
      oldSquare.classList.add(`${highlightMove}`);
      newSquare.classList.add(`${highlightMove}`);
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

  const clearHighlightedMove = () => {
    const squares = document.querySelectorAll('.square')

    squares.forEach(square => {
      square.classList.remove(`${highlightMove}`)
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
