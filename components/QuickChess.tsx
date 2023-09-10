// pages/QuickChess.tsx
import React, { useEffect, useState } from 'react'
import Piece from './Piece'
import { generateLegalMoves } from '@/utils/ChessMoves'
import { isCheckmate, isKingInCheck } from '@/utils/ChessGameplay'
import { findBestAIMove } from '@/utils/ChessAI'
// import { Hourglass } from 'react-loader-spinner'

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
  const [isLoading, setIsLoading] = useState(false)

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

        if (isKingInCheck(board, 'black')) {
          highlightKingInCheck('black')

          if (isCheckmate(board, 'black') || isCheckmate(board, 'white')) {
            console.log('Checkmate!')
            alert('Checkmate! You win!')
          }
        }
        else
          clearCheckHighlight('black')

        setIsLoading(true)
        setTimeout(() => {
          handleAIMove();
        }, 0);
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

  const handleAIMove = () => {
    setIsLoading(true)
    const move = findBestAIMove(board, true)
    if (!move) {
      setIsLoading(false)
      return
    }

    const { fromRow, fromCol, toRow, toCol } = move

    const updatedBoard = makeAIMove(board, fromRow, fromCol, toRow, toCol)
    setBoard(updatedBoard)
    clearHighlightedMove()
    clearCheckHighlight('black')
    highlightLastMove({ row: fromRow, col: fromCol }, toRow, toCol)
    setIsLoading(false)
  }

  const makeAIMove = (board: (string | null)[][], oldRow: number, oldCol: number, newRow: number, newCol: number) => {
    const updatedBoard = [...board]
    const selectedPiece = updatedBoard[oldRow][oldCol]
    updatedBoard[oldRow][oldCol] = null
    updatedBoard[newRow][newCol] = selectedPiece
    return updatedBoard
  }

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='bg-[#442922] p-8 relative'>
        {board.map((row, rowIndex) => (
          <div className={`flex ${isLoading ? 'opacity-70' : ''} `} key={rowIndex}>
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
        {/* {isLoading && (
          <div className='absolute inset-0 flex justify-center items-center'>
          <Hourglass
            visible={true}
            height="80"
            width="80"
            ariaLabel="hourglass-loading"
            wrapperStyle={{}}
            wrapperClass=""
            colors={['#306cce', '#72a1ed']}
          />
        </div>
        )} */}
      </div>
    </div>
  )
}

export default QuickChess