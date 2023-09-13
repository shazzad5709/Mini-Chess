import { GameState, Move } from "@/utils/ChessEngine"
import { useEffect, useState } from "react"
import Piece from "./Piece"
import { findBestMove } from "@/utils/AI"

type Props = {}

export default function Chess({ }: Props) {
  const [gs, setGs] = useState<GameState>(new GameState())
  const [board, setBoard] = useState(gs.board)
  const [validMoves, setValidMoves] = useState(gs.getValidMoves())
  const [position, setPosition] = useState({ row: 0, col: 0 })
  const [turn, setTurn] = useState(gs.whiteToMove)

  const highlightSelect = 'bg-orange-600'
  const highlightMove = 'bg-green-600'
  const highlightCheck = 'bg-red-600'

  useEffect(() => {
    if (gs.isInCheck()) {
      console.log(gs.blackKingPosition, gs.whiteKingPosition)
      gs.whiteToMove ? highlightKingInCheck(gs.whiteKingPosition[0], gs.whiteKingPosition[1]) : highlightKingInCheck(gs.blackKingPosition[0], gs.blackKingPosition[1])
    }

    if (gs.inCheckmate) {
      (gs.winner === 'white') ?
        alert('Checkate! YOU WIN!!!') : alert('Checkmate! YOU LOSE...')
    }
    else if (gs.inStalemate) {
      alert('Stalemate! ---DRAW---')
    }
    else if (gs.moveCount === 30) {
      if (gs.boardScore > 0) {
        alert('30 move rule! YOU WIN!!!')
      }
      else if (gs.boardScore < 0) {
        alert('30 move rule! YOU LOSE...')
      }
      else {
        alert('30 move rule! ---DRAW---')
      }
    }
    else if (!gs.whiteToMove) {
      setTimeout(() => {
        handleAIMove()
      }, 0)
    }
  }, [turn])

  const handleSquareClick = (row: number, col: number) => {
    const selectedPiece = board[row][col]
    if (selectedPiece.startsWith('w')) {
      clearHighlightedSquares()
      for (const element of validMoves) {
        if (element.startRow === row && element.startCol === col) {
          setPosition({ row, col })
          highlightSquare(element.endRow, element.endCol)
        }
      }
    }

    else {
      for (const element of validMoves) {
        if (element.endRow === row && element.endCol === col && element.startRow === position.row && element.startCol === position.col) {
          gs.makeMove(element)
          const updatedBoard = gs.board
          clearHighlightedSquares()
          clearHighlightedMove()
          highlightLastMove(element.startRow, element.startCol, element.endRow, element.endCol)
          setBoard(updatedBoard)
          setValidMoves(gs.getValidMoves())
          setTurn(gs.whiteToMove)
        }
      }
    }
  }

  const handleAIMove = () => {
    const move = findBestMove(gs, validMoves)
    // console.log(move)
    if (!move) {
      // console.log('no move found')
      return
    }

    gs.makeMove(move)
    const updatedBoard = gs.board
    clearHighlightedSquares()
    clearHighlightedMove()
    highlightLastMove(move.startRow, move.startCol, move.endRow, move.endCol)
    setBoard(updatedBoard)
    setValidMoves(gs.getValidMoves())
    setTurn(gs.whiteToMove)
  }

  const highlightKingInCheck = (row: number, col: number) => {
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);

    if (square) {
      square.classList.add(`${highlightCheck}`);
    }
  }

  // clear the highlighted king in check
  const clearCheckHighlight = () => {
    const square = document.querySelector(`.${highlightCheck}`);

    if (square) {
      square.classList.remove(`${highlightCheck}`);
    }
  }

  const highlightSquare = (row: number, col: number) => {
    const square = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);

    if (square) {
      square.classList.add(`${highlightSelect}`);
    }
  }

  const highlightLastMove = (fromRow: number, fromCol: number, row: number, col: number) => {
    const newSquare = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
    const oldSquare = document.querySelector(`.square[data-row="${fromRow}"][data-col="${fromCol}"]`);

    if (oldSquare && newSquare) {
      oldSquare.classList.add(`${highlightMove}`);
      newSquare.classList.add(`${highlightMove}`);
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

  const renderBoard = () => {
    return (
      <>

        <div className='h-screen flex items-center justify-center'>
          <div className='bg-[#442922] p-8 relative'>
            {board.map((row, rowIndex) => (
              <div className={`flex `} key={rowIndex}>
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
  return renderBoard()
}