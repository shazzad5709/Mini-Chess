// pages/QuickChess.tsx
import React, { useEffect, useState } from 'react'
import Piece from './Piece'
import { generateLegalMoves } from '@/utils/ChessMoves'
import { isCheckmate, isKingInCheck, validateMoves } from '@/utils/ChessGameplay'
import { findBestAIMove } from '@/utils/ChessAI'
import { Hourglass } from 'react-loader-spinner'
import toast from 'react-hot-toast'

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
  const [isBlackTurn, setIsBlackTurn] = useState(false)
  const [userMoveIndex, setUserMoveIndex] = useState(-1); // Add userMoveIndex state variable
  const [userMoveHistory, setUserMoveHistory] = useState<(string | null)[][][]>([]); // Add setUserMoveHistory


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

      let legalMoves = generateLegalMoves(selectedPiece, board, row, col)
      // iterate over each move to check if it is valid
      legalMoves = validateMoves(board, legalMoves, row, col)
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

        if (isKingInCheck(board, 'black')){
          highlightKingInCheck('black')
          toast.error('Check!')
        }
        
          
        else
          clearCheckHighlight('black')

        if (isCheckmate(board, 'black') || isCheckmate(board, 'white')) {
          // console.log('Checkmate!')
          // alert('Checkmate! You win!')
          toast.success('Checkmate! You win!')
        }

        

        setIsLoading(true)
        setIsBlackTurn(true)
        setLegalMoves([])
      }
    }
    // setUserMoveHistory((prevHistory) => {
    //   const newHistory = prevHistory.slice(0, userMoveIndex + 1);
    //   newHistory.push([...board]); // Add the current board state to userMoveHistory
    //   setUserMoveIndex(userMoveIndex + 1); // Increment userMoveIndex
    //   return newHistory;
    // });
    
    // Check for checkmate and handle AI move
    if (!isCheckmate(board, 'black') && isBlackTurn) {
      handleAIMove();
    }
  };

  useEffect(() => {
    if (isBlackTurn) {
      handleAIMove();
    }
  }, [isBlackTurn]);

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
      // toast.error('Check!')
    }
  }

  // clear the highlighted king in check
  const clearCheckHighlight = (color: string) => {
    const { row, col } = findKingPosition(color);
    const square = document.querySelector(`.${highlightCheck}`);

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
      // alert('Checkmate! You Win!')
      toast.success('Checkmate! You win!')
      return
    }

    const { fromRow, fromCol, toRow, toCol } = move

    const updatedBoard = makeAIMove(board, fromRow, fromCol, toRow, toCol)
    setBoard(updatedBoard)
    clearHighlightedMove()
    clearCheckHighlight('black')
    highlightLastMove({ row: fromRow, col: fromCol }, toRow, toCol)
    if (isKingInCheck(board, 'white')){
      highlightKingInCheck('white')
      toast.error('Check!')
      // alert('Check!')
    }
      
    else
      clearCheckHighlight('white')

    if (isCheckmate(board, 'white')) {
      // console.log('Checkmate!')
      toast.success('Checkmate! You win!')
      // alert('Checkmate! You win!')
    }
    setIsLoading(false)
    setIsBlackTurn(false)
  }

  const makeAIMove = (board: (string | null)[][], oldRow: number, oldCol: number, newRow: number, newCol: number) => {
    const updatedBoard = [...board]
    const selectedPiece = updatedBoard[oldRow][oldCol]
    updatedBoard[oldRow][oldCol] = null
    updatedBoard[newRow][newCol] = selectedPiece
    return updatedBoard
  }

  const handleUndoClick = () => {
    if (userMoveIndex > 0) { // Check if there are previous user moves
      const previousUserMove = userMoveHistory[userMoveIndex - 1];
      if (previousUserMove) {
        // Restore the board to the previous user move
        setBoard(previousUserMove);
        setUserMoveIndex(userMoveIndex - 1); // Decrement userMoveIndex
        // Clear the move history and legal moves
        setLegalMoves([]);
        clearHighlightedMove();
        // Toggle turn to the user
        setIsBlackTurn(false);
      }
    }
  };
  

  return (
    <div className='h-screen flex items-center justify-center'>
      {/* <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={handleUndoClick}>Undo</button> */}
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
        {isLoading && (
          <div className='absolute inset-0 flex justify-center items-center'>
            <Hourglass
              visible={true}
              height="80"
              width="80"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={['#6E260E', '#DAA06D']}
            />

          </div>
        )}
      </div>
    </div>
  )
}

export default QuickChess