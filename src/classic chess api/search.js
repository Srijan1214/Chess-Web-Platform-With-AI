import * as eval_necessities from "./evaluate.js"
import * as pvtable_necessities from "./pvtable.js"
import {
	PVENTRIES,
	NOMOVE,
	BOOL,
	MAXDEPTH,
	PCEINDEX,
	INFINITE,
	MFLAGCAP,
	FROMSQ,
	BRD_SQ_NUM,
	TOSQ,
	MATE,
	Kings,
	PROMOTED,
	MFLAGCA
} from "./defs.js"

export default class AI {
	constructor(GameBoard) {
		this.SearchController = {}
		this.GameBoard = GameBoard

		// Position Evaluation Necessities
		this.EvalPosition = eval_necessities.EvalPosition.bind(this)
		this.BishopPair = eval_necessities.BishopPair
		this.BishopTable = eval_necessities.BishopTable
		this.KnightTable = eval_necessities.KnightTable
		this.PawnTable = eval_necessities.PawnTable
		this.RookTable = eval_necessities.RookTable

		// Principle Variation (pvtable) table
		this.GetPvLine = pvtable_necessities.GetPvLine.bind(this)
		this.ProbePvTable = pvtable_necessities.ProbePvTable.bind(this)
		this.StorePvMove = pvtable_necessities.StorePvMove.bind(this)
		
		this.SetGameBoard(GameBoard)
	}

	SetGameBoard(GameBoard) {
		this.GameBoard = GameBoard
	}

	PickNextMove(MoveNum) {
		let index = 0
		let bestScore = -1
		let bestNum = MoveNum

		for (
			index = MoveNum;
			index < this.GameBoard.moveListStart[this.GameBoard.ply + 1];
			index++
		) {
			if (this.GameBoard.moveScores[index] > bestScore) {
				bestScore = this.GameBoard.moveScores[index]
				bestNum = index
			}
		}

		if (bestNum !== MoveNum) {
			let temp = this.GameBoard.moveScores[MoveNum]
			this.GameBoard.moveScores[MoveNum] = this.GameBoard.moveScores[bestNum]
			this.GameBoard.moveScores[bestNum] = temp

			temp = this.GameBoard.moveList[MoveNum]
			this.GameBoard.moveList[MoveNum] = this.GameBoard.moveList[bestNum]
			this.GameBoard.moveList[bestNum] = temp
		}
	}

	ClearPvTable() {
		let index

		for (index = 0; index < PVENTRIES; index++) {
			this.GameBoard.PvTable[index].move = NOMOVE
			this.GameBoard.PvTable[index].poskey = 0
		}
	}

	CheckUp() {
		if (
			Date.now() - this.SearchController.start >
			this.SearchController.time
		) {
			this.SearchController.stop = BOOL.TRUE
		}
	}

	IsRepetition() {
		let index = 0

		for (
			index = this.GameBoard.hisPly - this.GameBoard.fiftyMove;
			index < this.GameBoard.hisPly - 1;
			index++
		) {
			if (this.GameBoard.poskey === this.GameBoard.history[index].poskey) {
				return BOOL.TRUE
			}
		}
	}

	Quiescence(alpha, beta) {
		// Check Time Up
		if ((this.SearchController.nodes & 2047) === 0) {
			this.CheckUp()
		}

		this.SearchController.nodes += 1

		// Check Rep() Fifty Move
		if (
			(this.IsRepetition() || this.GameBoard.fiftyMove >= 100) &&
			this.GameBoard.ply !== 0
		) {
			return 0
		}

		if (this.GameBoard.ply > MAXDEPTH - 1) {
			return this.EvalPosition()
		}

		let Score = this.EvalPosition()

		if (Score >= beta) {
			return beta
		}

		if (Score > alpha) {
			alpha = Score
		}

		this.GameBoard.GenerateCaptures()

		let MoveNum = 0
		let Legal = 0
		let OldAlpha = alpha
		let BestMove = NOMOVE
		let Move = NOMOVE

		// Get PvMove
		// Order PvMove

		for (
			MoveNum = this.GameBoard.moveListStart[this.GameBoard.ply];
			MoveNum < this.GameBoard.moveListStart[this.GameBoard.ply + 1];
			++MoveNum
		) {
			// Pick Next Best Move
			this.PickNextMove(MoveNum)

			Move = this.GameBoard.moveList[MoveNum]
			if (this.GameBoard.MakeMove(Move) === BOOL.FALSE) {
				continue
			}
			Legal++
			Score = -this.Quiescence(-beta, -alpha)

			this.GameBoard.TakeMove()

			if (this.SearchController.stop === BOOL.TRUE) {
				return 0
			}

			if (Score > alpha) {
				if (Score >= beta) {
					if (Legal === 1) {
						this.SearchController.fhf += 1
					}
					this.SearchController.fh += 1

					return beta
				}
				alpha = Score
				BestMove = Move
			}
		}

		if (alpha !== OldAlpha) {
			this.StorePvMove(BestMove)
		}

		return alpha
	}

	AlphaBeta(alpha, beta, depth) {
		if (depth <= 0) {
			return this.Quiescence(alpha, beta)
		}

		// Check Time Up
		if ((this.SearchController.nodes & 2047) === 0) {
			this.CheckUp()
		}

		this.SearchController.nodes += 1

		// Check Rep() Fifty Move
		if (
			(this.IsRepetition() || this.GameBoard.fiftyMove >= 100) &&
			this.GameBoard.ply !== 0
		) {
			return 0
		}

		if (this.GameBoard.ply > MAXDEPTH - 1) {
			return this.EvalPosition()
		}

		let InCheck = this.GameBoard.SqAttacked(
			this.GameBoard.pList[PCEINDEX(Kings[this.GameBoard.side], 0)],
			this.GameBoard.side ^ 1
		)
		if (InCheck === BOOL.TRUE) {
			depth++
		}

		let Score = -INFINITE

		this.GameBoard.GenerateMoves()

		let MoveNum = 0
		let Legal = 0
		let OldAlpha = alpha
		let BestMove = NOMOVE
		let Move = NOMOVE

		let PvMove = this.ProbePvTable()
		if (PvMove !== NOMOVE) {
			for (
				MoveNum = this.GameBoard.moveListStart[this.GameBoard.ply];
				MoveNum < this.GameBoard.moveListStart[this.GameBoard.ply + 1];
				++MoveNum
			) {
				if (this.GameBoard.moveList[MoveNum] === PvMove) {
					this.GameBoard.moveScores[MoveNum] = 2000000
					break
				}
			}
		}

		// Get PvMove
		// Order PvMove

		for (
			MoveNum = this.GameBoard.moveListStart[this.GameBoard.ply];
			MoveNum < this.GameBoard.moveListStart[this.GameBoard.ply + 1];
			++MoveNum
		) {
			// Pick Next Best Move
			this.PickNextMove(MoveNum)

			Move = this.GameBoard.moveList[MoveNum]
			if (this.GameBoard.MakeMove(Move) === BOOL.FALSE) {
				continue
			}
			Legal++
			Score = -this.AlphaBeta(-beta, -alpha, depth - 1)

			this.GameBoard.TakeMove()
			if (this.SearchController.stop === BOOL.TRUE) {
				return 0
			}

			if (Score > alpha) {
				if (Score >= beta) {
					if (Legal === 1) {
						this.SearchController.fhf += 1
					}
					this.SearchController.fh += 1

					// Update Killer Moves
					if ((Move & MFLAGCAP) === 0) {
						// NON Capture move
						this.GameBoard.searchKillers[MAXDEPTH + this.GameBoard.ply] =
							this.GameBoard.searchKillers[this.GameBoard.ply]
						this.GameBoard.searchKillers[this.GameBoard.ply] = Move
					}

					return beta
				}

				// Piece history Moves prunning
				// e.g if a knight moving to d5 is good then the other knight moving to the same square is also
				// likely to be good
				if ((Move & MFLAGCAP) === 0) {
					// NON Capture move
					this.GameBoard.searchHistory[
						this.GameBoard.pieces[FROMSQ(Move)] * BRD_SQ_NUM + TOSQ(Move)
					] += depth * depth
				}
				alpha = Score
				BestMove = Move
			}
		}

		if (Legal === 0) {
			if (InCheck === BOOL.TRUE) {
				return -MATE + this.GameBoard.ply
			} else {
				return 0
			}
		}

		if (alpha !== OldAlpha) {
			this.StorePvMove(BestMove)
		}

		return alpha
	}

	ClearForSearch() {
		let index = 0

		for (index = 0; index < 14 * BRD_SQ_NUM; ++index) {
			this.GameBoard.searchHistory[index] = 0
		}

		for (index = 0; index < 3 * MAXDEPTH; ++index) {
			this.GameBoard.searchKillers[index] = 0
		}

		this.ClearPvTable()
		this.GameBoard.ply = 0
		this.SearchController.nodes = 0
		this.SearchController.fh = 0
		this.SearchController.fhf = 0
		this.SearchController.start = Date.now()
		this.SearchController.stop = BOOL.FALSE
	}

	SearchPosition() {
		let bestMove = NOMOVE
		let bestScore = -INFINITE
		let currentDepth = 0
		let line
		let PvNum
		let c
		this.ClearForSearch()

		for (currentDepth = 1; currentDepth <= 5; currentDepth++) {
			bestScore = this.AlphaBeta(-INFINITE, INFINITE, currentDepth)
			// Alpha Beta Search
			if (this.SearchController.stop === BOOL.TRUE) {
				break
			}
			bestMove = this.ProbePvTable()
			line =
				"D:" +
				currentDepth +
				" Best: " +
				this.GameBoard.PrMove(bestMove) +
				" Score: " +
				bestScore +
				" nodes: " +
				this.SearchController.nodes

			PvNum = this.GetPvLine(currentDepth)
			line += " Pv: "
			for (c = 0; c < PvNum; c++) {
				line += " " + this.GameBoard.PrMove(this.GameBoard.PvArray[c])
			}
			if (currentDepth !== 1) {
				line +=
					"Ordering:" +
					(
						(this.SearchController.fhf / this.SearchController.fh) *
						100
					).toFixed(2) +
					"%"
			}
			console.log(line)
		}

		this.SearchController.best = bestMove
		this.SearchController.thinking = BOOL.FALSE
		this.SearchController.bestScore = bestScore
		
		console.log(this.GameBoard.PrMove(bestMove))
		const ret_move = (this.GameBoard.PrMove(bestMove))
		const isCastling = (bestMove & MFLAGCA) !== 0
		const promotedPiece = PROMOTED(bestMove)
		return {
			from: ret_move.substring(0, 2),
			to: ret_move.substring(2, 4),
			isCastling: isCastling,
			promotedPiece: promotedPiece,
			move: bestMove
		}
	}

	GetBestScore() {
		return this.SearchController.bestScore
	}
}
