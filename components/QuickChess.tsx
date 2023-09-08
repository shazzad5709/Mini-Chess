// pages/QuickChess.tsx
import React, { useState } from 'react'
import Piece from './Piece'
import { generateLegalMoves } from '@/utils/ChessMoves'
import { isCheckmate, isKingInCheck } from '@/utils/ChessGameplay'

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
  const [selectedPiecePosition, setSelectedPiecePosition] = useState({ row: 0, col: 0 })
  const [legalMoves, setLegalMoves] = useState<number[][]>([])

  const highlightSelect = 'bg-orange-400'
  const highlightMove = 'bg-green-400'
  const highlightCheck = 'bg-red-400'

  // handle user's mouse-click on a square
  const handleSquareClick = (row: number, col: number) => {
    const selectedPiece = board[row][col]

    // selection of a new piece
    if (selectedPiece?.includes('white')) {
      setSelectedPiecePosition({ row, col })
      clearHighlightedSquares()
      highlightSquare(row, col)

      const legalMoves = generateLegalMoves(selectedPiece, board, row, col)
      setLegalMoves(legalMoves)
      highlightLegalMoves(legalMoves)
    }

    // making a move (either to blank square or to capture opponent's piece)
    else if ((selectedPiece === null && selectedPiecePosition !== null) || (selectedPiece?.includes('black'))) {
      if (isLegalMove(row, col, legalMoves)) {
        const updatedBoard = makeUserMove(board, selectedPiecePosition, row, col)
        clearHighlightedSquares()
        clearHighlightedMove()
        highlightLastMove(selectedPiecePosition, row, col)
        setBoard(updatedBoard)

        if (isCheck('black')) {
          highlightKingInCheck('black')
          if (isCheckmate(board, 'black')) {
            alert('Checkmate! You win!')
          }
        }
        else
          clearCheckHighlight('black')

        handleAIMove()
      }
    }
  }

  // check if the user's move is legal
  const isLegalMove = (row: number, col: number, legalMoves: number[][]) => {
    return legalMoves.some(move => {
      const [legalRow, legalCol] = move
      return legalRow === row && legalCol === col
    })
  }

  // update the board with the user's move
  const makeUserMove = (board: (string | null)[][], selectedPiecePosition: { row: number; col: number }, row: number, col: number) => {
    const updatedBoard = [...board]
    const [selectedRow, selectedCol] = [selectedPiecePosition.row, selectedPiecePosition.col]
    const selectedPiece = updatedBoard[selectedRow][selectedCol]
    updatedBoard[selectedRow][selectedCol] = null
    updatedBoard[row][col] = selectedPiece
    return updatedBoard
  }

  // highlight the last move made
  const highlightLastMove = (selectedPiecePosition: { row: number; col: number }, row: number, col: number) => {
    const newSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    const oldSquare = document.querySelector(`.square[data-row="${selectedPiecePosition.row}"][data-col="${selectedPiecePosition.col}"]`);

    if (oldSquare && newSquare) {
      oldSquare.classList.add(`${highlightMove}`);
      newSquare.classList.add(`${highlightMove}`);
    }
  }

  // highlight the legal moves a user can make for the selected piece
  const highlightLegalMoves = (legalMoves: number[][]) => {
    legalMoves.forEach(move => {
      const [row, col] = move
      highlightSquare(row, col)
    })
  }

  // highlight a selected square
  const highlightSquare = (row: number, col: number) => {
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);

    if (square) {
      square.classList.add(`${highlightSelect}`);
    }
  }

  // find the position of a specific king
  const findKingPosition = (color: string) => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 5; col++) {
        const piece = board[row][col];

        // Check if the square contains the white king
        if (piece && piece === `king-${color}`) {
          return { row, col }; // Found the white king, return its position
        }
      }
    }

    // White king not found on the board
    return { row: -1, col: -1 };
  };

  // highlight a king in check
  const highlightKingInCheck = (color: string) => {
    const { row, col } = findKingPosition(color);
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);

    if (square) {
      square.classList.add(`${highlightCheck}`);
    }
  }

  // clear the highlighted king in check
  const clearCheckHighlight = (color: string) => {
    const { row, col } = findKingPosition(color);
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);

    if (square) {
      square.classList.remove(`${highlightCheck}`);
    }
  }

  // clear all highlighted squares
  const clearHighlightedSquares = () => {
    const squares = document.querySelectorAll('.square')

    squares.forEach(square => {
      square.classList.remove(`${highlightSelect}`)
    })
  }

  // clear the highlighted move
  const clearHighlightedMove = () => {
    const squares = document.querySelectorAll('.square')

    squares.forEach(square => {
      square.classList.remove(`${highlightMove}`)
    })
  }

  // check if a king is in check
  const isCheck = (color: string) => {
    return isKingInCheck(board, color)
  };

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
