import { GameState, Move } from './ChessEngine'

const pieceScore: { [key: string]: number } = {
  'K': 0, 'Q': 9, 'R': 5, 'B': 3, 'N': 3, 'p': 1
}

const knightGoodPositions = [[1, 1, 1, 1, 1],
                       [1, 2, 2, 2, 1],
                       [1, 2, 3, 2, 1],
                       [1, 2, 3, 2, 1],
                       [1, 2, 2, 2, 1],
                       [1, 1, 1, 1, 1]]

const bishopGoodPositions = [[3, 2, 1, 2, 3],
                       [3, 3, 2, 3, 3],
                       [2, 3, 3, 3, 2],
                       [2, 3, 3, 3, 2],
                       [3, 3, 2, 3, 3],
                       [3, 2, 1, 2, 3]]

const queenGoodPositions = [[1, 2, 1, 2, 1],
                      [1, 2, 2, 2, 1],
                      [1, 2, 3, 2, 1],
                      [1, 2, 3, 2, 1],
                      [1, 2, 2, 2, 1],
                      [1, 2, 1, 2, 1]]

const rookGoodPositions = [[3, 3, 3, 3, 3],
                     [3, 2, 2, 2, 3],
                     [1, 2, 1, 2, 1],
                     [1, 2, 1, 2, 1],
                     [3, 2, 2, 2, 3],
                     [3, 3, 3, 3, 3]]

const whitePawnGoodPositions = [[5, 5, 5, 5, 5],
                          [4, 4, 4, 4, 4],
                          [3, 3, 3, 3, 3],
                          [2, 2, 2, 2, 2],
                          [1, 1, 1, 1, 1],
                          [0, 0, 0, 0, 0]]

const blackPawnGoodPositions = [[0, 0, 0, 0, 0],
                          [1, 1, 1, 1, 1],
                          [1, 2, 2, 2, 1],
                          [2, 3, 3, 3, 2],
                          [3, 4, 4, 4, 3],
                          [5, 5, 5, 5, 5],]
const checkmate = 1000
const stalemate = 0
const DEPTH = 3

let nextMove: Move
let undoC: number = 0
let moveC: number = 0

export function findRandomMove(validMoves: Move[]) {
  const randomIndex = Math.floor(Math.random() * validMoves.length)
  return validMoves[randomIndex]
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function findBestMove(gs: GameState, validMoves: Move[]) {
  shuffleArray(validMoves)

  const start_time = performance.now()

  findMoveNegaMaxAlphaBetaPVS(gs, validMoves, DEPTH, -checkmate, checkmate, gs.whiteToMove ? 1 : -1)

  const end_time = performance.now()
  console.log(`Time: ${(end_time - start_time) / 1000}s`)
  // console.log(`Move: ${moveC}`)

  return nextMove
}

function findMoveNegaMaxAlphaBetaPVS(
  gs: GameState,
  validMoves: Move[],
  depth: number,
  alpha: number,
  beta: number,
  turnMultiplier: number
) {
  if (depth === 0) {
    return turnMultiplier * scoreBoard(gs)
  }

  const orderedMoves = orderMoves(validMoves, gs)
  let maxScore = -checkmate

  if (orderedMoves.length > 0) {
    const move = orderedMoves[0]
    gs.makeMove(move)
    moveC++
    const nextMoves = gs.getValidMoves()
    const score = -findMoveNegaMaxAlphaBetaPVS(gs, nextMoves, depth - 1, -beta, -alpha, -turnMultiplier)
    gs.undoMove()
    undoC++

    if (score > maxScore) {
      maxScore = score
      if (depth === DEPTH) {
        nextMove = move
      }
      alpha = Math.max(alpha, score)
      if (alpha >= beta) {
        return maxScore
      }
    }
  }

  for (let i = 1; i < orderedMoves.length; i++) {
    const move = orderedMoves[i]
    gs.makeMove(move)
    moveC++
    const nextMoves = gs.getValidMoves()
    let score = -findMoveNegaMaxAlphaBetaPVS(gs, nextMoves, depth - 1, -alpha - 1, -alpha, -turnMultiplier)

    if (score > alpha && score < beta) {
      score = -findMoveNegaMaxAlphaBetaPVS(gs, nextMoves, depth - 1, -beta, -score, -turnMultiplier)
    }

    gs.undoMove()
    undoC++

    if (score > maxScore) {
      maxScore = score
      if (depth === DEPTH) {
        nextMove = move
      }
      alpha = Math.max(alpha, score)
      if (alpha >= beta) {
        break
      }
    }
  }

  return maxScore
}

function scoreBoard(gs: GameState) {
  if (gs.inCheckmate) {
    if (gs.whiteToMove) {
      return -checkmate
    }

    return checkmate
  }
  else if (gs.inStalemate) {
    return stalemate
  }

  let score = 0
  for (const row of gs.board) {
    for (const square of row) {
      if (square.startsWith('w')) {
        score += pieceScore[square[1]]
      }
      else if (square.startsWith('b')) {
        score -= pieceScore[square[1]]
      }
    }
  }

  return score
}

function orderMoves(validMoves: Move[], gs: GameState) {
  const orderedMoves: Move[] = []

  function evaluate_move(move: Move) {
    let score = 0
    if (move.pieceCaptured !== '--') {
      score = pieceScore[move.pieceCaptured[1]] / 2
    }

    if (gs.inCheckmate) {
      if (gs.whiteToMove) {
        score -= checkmate
      }
      else {
        score += checkmate
      }
    }

    return score
  }

  orderedMoves.push(...validMoves)

  orderedMoves.sort((a, b) => {
    const scoreA = evaluate_move(a)
    const scoreB = evaluate_move(b)

    return scoreB - scoreA
  })
  return orderedMoves.slice(0, 10)
}

export function calculateLimitReachScore (gs: GameState) {
  // calculate the score of the board
  let score = 0
  for (const row of gs.board) {
    for (const square of row) {
      if (square.startsWith('w')) {
        score += pieceScore[square[1]]
      }
      else if (square.startsWith('b')) {
        score -= pieceScore[square[1]]
      }
    }
  }

  return score
}