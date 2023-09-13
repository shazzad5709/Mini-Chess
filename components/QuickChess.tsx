// pages/QuickChess.tsx
import React, { useEffect, useState } from 'react'
import Piece from './Piece'
import { GameState } from '@/utils/ChessEngine'

const QuickChess: React.FC = () => {
  const board = new GameState().board

  // const moveAudio = new Audio('/moveSound.wav');
  // moveAudio.preload = 'auto';

  // const userCaptureAudio = new Audio('/userCapture.wav');
  // userCaptureAudio.preload = 'auto';

  // const aiCaptureAudio = new Audio('/aiCapture.wav');
  // aiCaptureAudio.preload = 'auto';


  const [selectedPiecePosition, setSelectedPiecePosition] = useState({ row: 0, col: 0 })
  const [legalMoves, setLegalMoves] = useState<number[][]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBlackTurn, setIsBlackTurn] = useState(false)
  const [userMoveHistory, setUserMoveHistory] = useState<(string | null)[][]>([...initialBoard]);
  const [userMoveIndex, setUserMoveIndex] = useState<number>(0);

  const highlightSelect = 'bg-yellow-600'
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

        // check if black king if checkmate
        if (isCheckmate(board, 'black')) {
          alert('Checkmate! You WIN!')
          resetBoard()
          return
        }

        if (isKingInCheck(board, 'black')) {

          highlightKingInCheck('black')
        }
        else
          clearCheckHighlight('black')

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
    renderBoard()
    if (isBlackTurn) {
      handleAIMove()
    }
    renderBoard()
  }, [isBlackTurn])

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
    let selectedPiece = updatedBoard[selectedRow][selectedCol]

    if (selectedPiece?.includes('pawn') && (row === 0)) {
      selectedPiece = 'queen-white'
    }
    updatedBoard[selectedRow][selectedCol] = null
    updatedBoard[row][col] = selectedPiece

    // if (selectedPiece !== null && selectedPiece !== updatedBoard[row][col]) {
    //   userCaptureAudio.play();
    // }

    // moveAudio.play();
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
      return
    }

    const { fromRow, fromCol, toRow, toCol } = move

    const updatedBoard = makeAIMove(board, fromRow, fromCol, toRow, toCol)
    setBoard(updatedBoard)
    clearHighlightedMove()
    clearCheckHighlight('black')
    highlightLastMove({ row: fromRow, col: fromCol }, toRow, toCol)
    if (isKingInCheck(board, 'white')) {
      highlightKingInCheck('white')
      // toast.error('Check!')
    }

    else
      clearCheckHighlight('white')

    if (isCheckmate(board, 'white')) {
      alert('Checkmate! You LOSE!')
      resetBoard()
    }

    setIsLoading(false)
    setIsBlackTurn(false)
  }

  const resetBoard = () => {
    setBoard(initialBoard)
    setIsLoading(false)
    setIsBlackTurn(false)
    clearHighlightedSquares()
    clearHighlightedMove()
    clearCheckHighlight('white')
    clearCheckHighlight('black')
  }

  const makeAIMove = (board: (string | null)[][], oldRow: number, oldCol: number, newRow: number, newCol: number) => {
    const updatedBoard = [...board]
    let selectedPiece = updatedBoard[oldRow][oldCol]

    if (selectedPiece?.includes('pawn') && (newRow === 5)) {
      selectedPiece = 'queen-black'
    }

    updatedBoard[oldRow][oldCol] = null
    updatedBoard[newRow][newCol] = selectedPiece

    // if (selectedPiece !== null && selectedPiece !== updatedBoard[newRow][newCol]) {
    //   aiCaptureAudio.play();
    // }

    // moveAudio.play();
    return updatedBoard
  }

  const renderBoard = () => {
    return (
      <>

        <div className='h-screen flex items-center justify-center'>
          <div className='bg-[#442922] p-8 relative'>
            {board.map((row, rowIndex) => (
              <div className={`flex ${isLoading ? '' : ''} `} key={rowIndex}>
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
      </>
    )
  }


  return (
    <>
      <div className='h-screen flex items-center justify-center'>
        <div className='bg-[#442922] p-8 relative'>
          {board.map((row, rowIndex) => (
            <div className={`flex`} key={rowIndex}>
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
    </>
  )
}

export default QuickChess