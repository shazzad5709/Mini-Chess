import { calculateLimitReachScore } from "./AI"

export class Move {
  ranksToRows: Record<string, number> = {
    '1': 5,
    '2': 4,
    '3': 3,
    '4': 2,
    '5': 1,
    '6': 0,
  }

  rowsToRanks: Record<number, string> = Object.entries(this.ranksToRows).reduce(
    (acc, [key, value]) => ({ ...acc, [value]: key }),
    {}
  )

  filesToCols: Record<string, number> = {
    'a': 0,
    'b': 1,
    'c': 2,
    'd': 3,
    'e': 4,
  }

  colsToFiles: Record<number, string> = Object.entries(this.filesToCols).reduce(
    (acc, [key, value]) => ({ ...acc, [value]: key }),
    {}
  )

  startRow: number
  startCol: number
  endRow: number
  endCol: number
  pieceMoved: string
  pieceCaptured: string
  moveId: number
  isPawnPromotion: boolean
  pieceCapturedByPawn: string

  constructor(startSq: number[], endSq: number[], board: (string)[][]) {
    this.startRow = startSq[0]
    this.startCol = startSq[1]
    this.endRow = endSq[0]
    this.endCol = endSq[1]
    this.pieceMoved = board[this.startRow][this.startCol]
    this.pieceCaptured = board[this.endRow][this.endCol]
    this.moveId = this.startRow * 1000 + this.startCol * 100 + this.endRow * 10 + this.endCol

    this.pieceMoved = board[this.startRow][this.startCol]
    this.pieceCaptured = board[this.endRow][this.endCol]

    this.pieceCapturedByPawn = 'p'
    this.isPawnPromotion = (this.pieceMoved == 'wp' && this.endRow == 0)
      || (this.pieceMoved == 'bp' && this.endRow == 5)
  }

  equals(other: Move): boolean {
    return this.moveId === other.moveId;
  }

  getChessNotation() {
    let notation = this.getRankFile(this.startRow, this.startCol) + this.getRankFile(this.endRow, this.endCol)
    if (this.pieceMoved[1] != 'p')
      notation = this.pieceMoved?.charAt(0).toUpperCase() + notation

    return notation
  }

  getRankFile(row: number, col: number): string {
    return this.colsToFiles[col] + this.rowsToRanks[row]
  }
}

export class GameState {

  board: (string)[][] = [
    ["bR", "bB", "bQ", "bK", "bN"],
    ["bp", "bp", "bp", "bp", "bp"],
    ["--", "--", "--", "--", "--"],
    ["--", "--", "--", "--", "--"],
    ["wp", "wp", "wp", "wp", "wp"],
    ["wR", "wB", "wQ", "wK", "wN"]
  ]

  whiteToMove: boolean = true
  moveLog: Move[] = []
  moveCount: number = 0
  whiteKingPosition: [number, number] = [5, 3]
  blackKingPosition: [number, number] = [0, 3]

  inCheck = false
  inCheckmate = false
  winner = ''
  inStalemate = false
  boardScore = 0

  pins: any[] = []
  checks: any[] = []

  moveFunctions: { [key: string]: (row: number, col: number, moves: Move[]) => void }

  constructor() {
    this.moveFunctions = {
      'p': this.getPawnMoves.bind(this),
      'R': this.getRookMoves.bind(this),
      'B': this.getBishopMoves.bind(this),
      'Q': this.getQueenMoves.bind(this),
      'K': this.getKingMoves.bind(this),
      'N': this.getKnightMoves.bind(this)
    }
  }

  makeMove(move: Move) {
    this.board[move.endRow][move.endCol] = move.pieceMoved
    this.board[move.startRow][move.startCol] = '--'

    if (move.pieceMoved[1] == 'p') {
      if (move.pieceCaptured[1] != '-') {
        move.pieceCapturedByPawn = move.pieceCaptured[1]
      }
      else {
        for (let i = this.moveLog.length - 1; i >= 0; i--) {
          if ((this.moveLog[i].endRow, this.moveLog[i].endCol) == (move.startRow, move.startCol) && (this.moveLog[i].pieceMoved == move.pieceMoved)) {
            move.pieceCapturedByPawn = this.moveLog[i].pieceCapturedByPawn
            break
          }
        }
      }
    }

    this.moveLog.push(move)
    this.whiteToMove = !this.whiteToMove
    this.moveCount++

    if (move.pieceMoved === 'wK') {
      this.whiteKingPosition = [move.endRow, move.endCol]
    } else if (move.pieceMoved === 'bK') {
      this.blackKingPosition = [move.endRow, move.endCol]
    }

    if (move.isPawnPromotion) {
      this.board[move.endRow][move.endCol] = move.pieceMoved[0] + 'Q'
    }

    if (this.moveCount>=30) {
      this.boardScore = calculateLimitReachScore(this)
    }
  }

  undoMove() {
    if (this.moveLog.length != 0) {
      let move = this.moveLog.pop()
      this.board[move!.startRow][move!.startCol] = move!.pieceMoved
      this.board[move!.endRow][move!.endCol] = move!.pieceCaptured
      this.whiteToMove = !this.whiteToMove

      if (move!.pieceMoved === 'wK') {
        this.whiteKingPosition = [move!.startRow, move!.startCol]
      } else if (move!.pieceMoved === 'bK') {
        this.blackKingPosition = [move!.startRow, move!.startCol]
      }

      this.moveCount--
      this.inCheckmate = false
      this.winner = ''
      this.inStalemate = false
    }
  }

  getValidMoves() {
    let moves: Move[] = this.getAllPossibleMoves()
    let kingRow: number, kingCol: number, check: any, checkRow: number, checkCol: number, pieceChecking: string, validSquares: [number, number][]
    // [this.inCheck, this.pins, this.checks] = this.checkForPinsAndChecks()

    if (this.whiteToMove) {
      kingRow = this.whiteKingPosition[0]
      kingCol = this.whiteKingPosition[1]
    }
    else {
      kingRow = this.blackKingPosition[0]
      kingCol = this.blackKingPosition[1]
    }

    for (let i = moves.length - 1; i >= 0; i--) {
      this.makeMove(moves[i])
      this.whiteToMove = !this.whiteToMove

      if (this.isInCheck()) {
        moves.splice(i, 1)
      }

      this.whiteToMove = !this.whiteToMove
      this.undoMove()
    }

    if (moves.length == 0) {
      if (this.inCheck) {
        this.inCheckmate = true
        this.winner = this.whiteToMove ? 'b' : 'w'
      }
      else {
        this.inStalemate = true
      }
    }

    return moves
  }

  isInCheck() {
    if (this.whiteToMove) {
      return this.squareUnderAttack(this.whiteKingPosition[0], this.whiteKingPosition[1])
    }

    return this.squareUnderAttack(this.blackKingPosition[0], this.blackKingPosition[1])
  }

  squareUnderAttack(row: number, col: number) {
    this.whiteToMove = !this.whiteToMove
    let attacks = this.getAllPossibleMoves()
    this.whiteToMove = !this.whiteToMove

    for (const element of attacks) {
      if (element.endRow == row && element.endCol == col) {
        return true
      }
    }

    return false
  }

  checkForPinsAndChecks(): [boolean, number[][], number[][]] {
    let inCheck = false
    let pins: number[][] = []
    let checks: number[][] = []
    let enemyColor: string
    let allyColor: string
    let startRow: number
    let startCol: number

    if (this.whiteToMove) {
      enemyColor = 'b'
      allyColor = 'w'
      startRow = this.whiteKingPosition[0]
      startCol = this.whiteKingPosition[1]
    }
    else {
      enemyColor = 'w'
      allyColor = 'b'
      startRow = this.blackKingPosition[0]
      startCol = this.blackKingPosition[1]
    }

    let directions = [[-1, 0], [0, -1], [1, 0], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]

    for (let i = 0; i < directions.length; i++) {
      let direction = directions[i]
      let possiblePin: number[] = []
      for (let j = 1; j < 6; j++) {
        let endRow = startRow + direction[0] * j
        let endCol = startCol + direction[1] * j
        if (0 <= endRow && endRow < this.board.length && 0 <= endCol && endCol < this.board[0].length) {
          let endPiece = this.board[endRow][endCol]
          if (endPiece[0].startsWith(allyColor) && endPiece[1] != 'K') {
            if (possiblePin.length == 0) {
              possiblePin = [endRow, endCol, direction[0], direction[1]]
            }
            else {
              break
            }
          }
          else if (endPiece[0].startsWith(enemyColor)) {
            let type = endPiece[1]
            if ((type == 'R' && i < 4) || (type == 'B' && i >= 4 && i < 8)
              || (j == 1 && type == 'p' && ((enemyColor == 'w' && 6 <= i && i <= 7) || (enemyColor == 'b' && 4 <= i && i <= 5)))
              || (type == 'Q') || (j == 1 && type == 'K')
            ) {
              if (possiblePin.length == 0) {
                inCheck = true
                checks.push([endRow, endCol, direction[0] as unknown as number, direction[1] as unknown as number])
                break
              }
              else {
                pins.push(possiblePin)
                break
              }
            }
            else {
              break
            }
          }
        }
        else {
          break
        }
      }

      let knightDirections = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]
      for (let direction in knightDirections) {
        let endRow = startRow + (direction[0] as unknown as number)
        let endCol = startCol + (direction[1] as unknown as number)

        if (0 <= endRow && endRow < this.board.length && 0 <= endCol && endCol < this.board[0].length) {
          let endPiece = this.board[endRow][endCol]
          if (endPiece[0].startsWith(enemyColor) && endPiece[1] == 'N') {
            inCheck = true
            checks.push([endRow, endCol, direction[0] as unknown as number, direction[1] as unknown as number])
            break
          }
        }

      }
    }

    return [inCheck, pins, checks]
  }

  switchPlayer() {
    this.whiteToMove = !this.whiteToMove
  }

  getAllPossibleMoves(): Move[] {
    let moves: Move[] = []
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 5; c++) {
        let turn = this.board[r][c][0]
        if ((turn == 'w' && this.whiteToMove) || (turn == 'b' && !this.whiteToMove)) {
          if (this.board[r][c][1] == 'p' && (r == 0 || r == 5)) {
            continue
          }
          let piece = this.board[r][c][1]
          this.useMoveFunction(piece, r, c, moves)
        }
      }
    }

    return moves
  }

  useMoveFunction(piece: string, r: number, c: number, moves: Move[]) {
    const moveFunction = this.moveFunctions[piece];
    if (moveFunction) {
      moveFunction(r, c, moves);
    }
  }

  getPawnMoves(r: number, c: number, moves: Move[]): void {
    let piecePinned = false;
    let pinDirection: [number, number] = [0, 0];

    // for (let i = this.pins.length - 1; i >= 0; i--) {
    //   if (r === this.pins[i][0] && c === this.pins[i][1]) {
    //     piecePinned = true;
    //     pinDirection = [this.pins[i][2], this.pins[i][3]];
    //     this.pins.splice(i, 1);
    //     break;
    //   }
    // }

    if (this.whiteToMove) {
      if (this.board[r - 1][c] === '--') {
        moves.push(new Move([r, c], [r - 1, c], this.board));
      }
      if (c - 1 >= 0) {
        if (this.board[r - 1][c - 1].startsWith('b')) {
          moves.push(new Move([r, c], [r - 1, c - 1], this.board));
        }
      }
      if (c + 1 < this.board[r].length) {
        if (this.board[r - 1][c + 1].startsWith('b')) {
          moves.push(new Move([r, c], [r - 1, c + 1], this.board));
        }
      }
    } else {
      if (this.board[r + 1][c] === '--') {
        moves.push(new Move([r, c], [r + 1, c], this.board));
      }
      if (c - 1 >= 0) {
        if (this.board[r + 1][c - 1].startsWith('w')) {
          moves.push(new Move([r, c], [r + 1, c - 1], this.board));
        }
      }
      if (c + 1 < this.board[r].length) {
        if (this.board[r + 1][c + 1].startsWith('w')) {
          moves.push(new Move([r, c], [r + 1, c + 1], this.board));
        }
      }
    }
  }


  getRookMoves(r: number, c: number, moves: Move[]): void {
    let piecePinned = false;
    let pinDirection: [number, number] = [0, 0];

    // for (let i = this.pins.length - 1; i >= 0; i--) {
    //   if (r === this.pins[i][0] && c === this.pins[i][1]) {
    //     piecePinned = true;
    //     pinDirection = [this.pins[i][2], this.pins[i][3]];
    //     if (this.board[r][c][1] !== 'Q') {
    //       this.pins.splice(i, 1);
    //     }
    //     break;
    //   }
    // }

    const enemyColor = this.whiteToMove ? 'b' : 'w';
    const directions: [number, number][] = [
      [1, 0], // Down
      [-1, 0], // Up
      [0, 1], // Right
      [0, -1], // Left
    ];

    for (const d of directions) {
      for (let i = 1; i < this.board.length; i++) {
        const endRow = r + d[0] * i;
        const endCol = c + d[1] * i;

        if (
          endRow >= 0 &&
          endRow < this.board.length &&
          endCol >= 0 &&
          endCol < this.board[0].length
        ) {

          const endPiece = this.board[endRow][endCol];

          if (endPiece === '--') {
            moves.push(new Move([r, c], [endRow, endCol], this.board));
          } else if (endPiece.startsWith(enemyColor)) {
            moves.push(new Move([r, c], [endRow, endCol], this.board));
            break;
          } else {
            break;
          }

        } else {
          break;
        }
      }
    }
  }

  getBishopMoves(r: number, c: number, moves: Move[]): void {
    let piecePinned = false;
    let pinDirection: [number, number] = [0, 0];



    const directions: [number, number][] = [
      [1, 1], // Down-right
      [1, -1], // Down-left
      [-1, -1], // Up-left
      [-1, 1], // Up-right
    ];

    const enemyColor = this.whiteToMove ? 'b' : 'w';

    for (const d of directions) {
      for (let i = 1; i < Math.max(this.board.length, this.board[0].length); i++) {
        const endRow = r + d[0] * i;
        const endCol = c + d[1] * i;

        if (
          endRow >= 0 &&
          endRow < this.board.length &&
          endCol >= 0 &&
          endCol < this.board[0].length
        ) {

          const endPiece = this.board[endRow][endCol];

          if (endPiece === '--') {
            moves.push(new Move([r, c], [endRow, endCol], this.board));
          } else if (endPiece[0] === enemyColor) {
            moves.push(new Move([r, c], [endRow, endCol], this.board));
            break;
          } else {
            break;
          }

        } else {
          break;
        }
      }
    }
  }

  getQueenMoves(r: number, c: number, moves: Move[]) {
    this.getRookMoves(r, c, moves);
    this.getBishopMoves(r, c, moves);
  }

  getKingMoves(r: number, c: number, moves: Move[]): void {
    const directions: [number, number][] = [
      [1, -1],
      [1, 1],
      [-1, -1],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, 0],
      [-1, 0],
    ];

    const allyColor = this.whiteToMove ? 'w' : 'b';

    for (const dir of directions) {
      const endRow = r + dir[0];
      const endCol = c + dir[1];

      if (
        endRow >= 0 &&
        endRow < this.board.length &&
        endCol >= 0 &&
        endCol < this.board[0].length
      ) {
        const endPiece = this.board[endRow][endCol];

        if (endPiece[0] !== allyColor) {
          // Update king location
          if (allyColor === 'w') {
            this.whiteKingPosition = [endRow, endCol];
          } else {
            this.blackKingPosition = [endRow, endCol];
          }

          // Check for pins and checks
          const [inCheck] = this.checkForPinsAndChecks();

          if (!inCheck) {
            moves.push(new Move([r, c], [endRow, endCol], this.board));
          }

          // Restore king location
          if (allyColor === 'w') {
            this.whiteKingPosition = [r, c];
          } else {
            this.blackKingPosition = [r, c];
          }
        }
      }
    }
  }

  getKnightMoves(r: number, c: number, moves: Move[]): void {
    let piecePinned = false;



    const directions: [number, number][] = [
      [2, -1],
      [2, 1],
      [1, 2],
      [-1, 2],
      [1, -2],
      [-1, -2],
      [-2, 1],
      [-2, -1],
    ];

    const allyColor = this.whiteToMove ? 'w' : 'b';

    for (const dir of directions) {
      const endRow = r + dir[0];
      const endCol = c + dir[1];

      if (
        endRow >= 0 &&
        endRow < this.board.length &&
        endCol >= 0 &&
        endCol < this.board[0].length
      ) {

        const endPiece = this.board[endRow][endCol];

        if (endPiece[0] !== allyColor) {
          moves.push(new Move([r, c], [endRow, endCol], this.board));
        }

      }
    }
  }

  isGameOver(): boolean {
    return this.inCheckmate || this.inStalemate
  }
}