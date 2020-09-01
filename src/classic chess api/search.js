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
	MFLAGCA,
	MFLAGEP
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

	SetGameBoard(a_GameBoard) {
		this.GameBoard = a_GameBoard
	}

	PickNextMove(a_move_number) {
		let index = 0
		let bestScore = -1
		let bestNum = a_move_number

		for (
			index = a_move_number;
			index < this.GameBoard.m_moveListStart[this.GameBoard.m_ply + 1];
			index++
		) {
			if (this.GameBoard.m_moveScores[index] > bestScore) {
				bestScore = this.GameBoard.m_moveScores[index]
				bestNum = index
			}
		}

		if (bestNum !== a_move_number) {
			let temp = this.GameBoard.m_moveScores[a_move_number]
			this.GameBoard.m_moveScores[a_move_number] = this.GameBoard.m_moveScores[bestNum]
			this.GameBoard.m_moveScores[bestNum] = temp

			temp = this.GameBoard.m_moveList[a_move_number]
			this.GameBoard.m_moveList[a_move_number] = this.GameBoard.m_moveList[bestNum]
			this.GameBoard.m_moveList[bestNum] = temp
		}
	}

	ClearPvTable() {
		let index

		for (index = 0; index < PVENTRIES; index++) {
			this.GameBoard.m_PvTable[index].move = NOMOVE
			this.GameBoard.m_PvTable[index].poskey = 0
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
			index = this.GameBoard.m_hisPly - this.GameBoard.m_fiftyMove;
			index < this.GameBoard.m_hisPly - 1;
			index++
		) {
			if (this.GameBoard.m_poskey === this.GameBoard.m_history[index].poskey) {
				return BOOL.TRUE
			}
		}
	}

	Quiescence(a_alpha, a_beta) {
		// Check Time Up
		if ((this.SearchController.nodes & 2047) === 0) {
			this.CheckUp()
		}

		this.SearchController.nodes += 1

		// Check Rep() Fifty Move
		if (
			(this.IsRepetition() || this.GameBoard.m_fiftyMove >= 100) &&
			this.GameBoard.m_ply !== 0
		) {
			return 0
		}

		if (this.GameBoard.m_ply > MAXDEPTH - 1) {
			return this.EvalPosition()
		}

		let Score = this.EvalPosition()

		if (Score >= a_beta) {
			return a_beta
		}

		if (Score > a_alpha) {
			a_alpha = Score
		}

		this.GameBoard.GenerateCaptures()

		let MoveNum = 0
		let Legal = 0
		let OldAlpha = a_alpha
		let BestMove = NOMOVE
		let Move = NOMOVE

		// Get PvMove
		// Order PvMove

		for (
			MoveNum = this.GameBoard.m_moveListStart[this.GameBoard.m_ply];
			MoveNum < this.GameBoard.m_moveListStart[this.GameBoard.m_ply + 1];
			++MoveNum
		) {
			// Pick Next Best Move
			this.PickNextMove(MoveNum)

			Move = this.GameBoard.m_moveList[MoveNum]
			if (this.GameBoard.MakeMove(Move) === BOOL.FALSE) {
				continue
			}
			Legal++
			Score = -this.Quiescence(-a_beta, -a_alpha)

			this.GameBoard.TakeMove()

			if (this.SearchController.stop === BOOL.TRUE) {
				return 0
			}

			if (Score > a_alpha) {
				if (Score >= a_beta) {
					if (Legal === 1) {
						this.SearchController.fhf += 1
					}
					this.SearchController.fh += 1

					return a_beta
				}
				a_alpha = Score
				BestMove = Move
			}
		}

		if (a_alpha !== OldAlpha) {
			this.StorePvMove(BestMove)
		}

		return a_alpha
	}

	AlphaBeta(a_alpha, a_beta, a_depth) {
		if (a_depth <= 0) {
			return this.Quiescence(a_alpha, a_beta)
		}

		// Check Time Up
		if ((this.SearchController.nodes & 2047) === 0) {
			this.CheckUp()
		}

		this.SearchController.nodes += 1

		// Check Rep() Fifty Move
		if (
			(this.IsRepetition() || this.GameBoard.m_fiftyMove >= 100) &&
			this.GameBoard.m_ply !== 0
		) {
			return 0
		}

		if (this.GameBoard.m_ply > MAXDEPTH - 1) {
			return this.EvalPosition()
		}

		let InCheck = this.GameBoard.SqAttacked(
			this.GameBoard.m_pList[PCEINDEX(Kings[this.GameBoard.m_side], 0)],
			this.GameBoard.m_side ^ 1
		)
		if (InCheck === BOOL.TRUE) {
			a_depth++
		}

		let Score = -INFINITE

		this.GameBoard.GenerateMoves()

		let MoveNum = 0
		let Legal = 0
		let OldAlpha = a_alpha
		let BestMove = NOMOVE
		let Move = NOMOVE

		let PvMove = this.ProbePvTable()
		if (PvMove !== NOMOVE) {
			for (
				MoveNum = this.GameBoard.m_moveListStart[this.GameBoard.m_ply];
				MoveNum < this.GameBoard.m_moveListStart[this.GameBoard.m_ply + 1];
				++MoveNum
			) {
				if (this.GameBoard.m_moveList[MoveNum] === PvMove) {
					this.GameBoard.m_moveScores[MoveNum] = 2000000
					break
				}
			}
		}

		// Get PvMove
		// Order PvMove

		for (
			MoveNum = this.GameBoard.m_moveListStart[this.GameBoard.m_ply];
			MoveNum < this.GameBoard.m_moveListStart[this.GameBoard.m_ply + 1];
			++MoveNum
		) {
			// Pick Next Best Move
			this.PickNextMove(MoveNum)

			Move = this.GameBoard.m_moveList[MoveNum]
			if (this.GameBoard.MakeMove(Move) === BOOL.FALSE) {
				continue
			}
			Legal++
			Score = -this.AlphaBeta(-a_beta, -a_alpha, a_depth - 1)

			this.GameBoard.TakeMove()
			if (this.SearchController.stop === BOOL.TRUE) {
				return 0
			}

			if (Score > a_alpha) {
				if (Score >= a_beta) {
					if (Legal === 1) {
						this.SearchController.fhf += 1
					}
					this.SearchController.fh += 1

					// Update Killer Moves
					if ((Move & MFLAGCAP) === 0) {
						// NON Capture move
						this.GameBoard.m_searchKillers[MAXDEPTH + this.GameBoard.m_ply] =
							this.GameBoard.m_searchKillers[this.GameBoard.m_ply]
						this.GameBoard.m_searchKillers[this.GameBoard.m_ply] = Move
					}

					return a_beta
				}

				// Piece history Moves prunning
				// e.g if a knight moving to d5 is good then the other knight moving to the same square is also
				// likely to be good
				if ((Move & MFLAGCAP) === 0) {
					// NON Capture move
					this.GameBoard.m_searchHistory[
						this.GameBoard.m_pieces[FROMSQ(Move)] * BRD_SQ_NUM + TOSQ(Move)
					] += a_depth * a_depth
				}
				a_alpha = Score
				BestMove = Move
			}
		}

		if (Legal === 0) {
			if (InCheck === BOOL.TRUE) {
				return -MATE + this.GameBoard.m_ply
			} else {
				return 0
			}
		}

		if (a_alpha !== OldAlpha) {
			this.StorePvMove(BestMove)
		}

		return a_alpha
	}

	ClearForSearch() {
		let index = 0

		for (index = 0; index < 14 * BRD_SQ_NUM; ++index) {
			this.GameBoard.m_searchHistory[index] = 0
		}

		for (index = 0; index < 3 * MAXDEPTH; ++index) {
			this.GameBoard.m_searchKillers[index] = 0
		}

		this.ClearPvTable()
		this.GameBoard.m_ply = 0
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
				line += " " + this.GameBoard.PrMove(this.GameBoard.m_PvArray[c])
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
		const enPass = (bestMove & MFLAGEP) !==0
		const promotedPiece = PROMOTED(bestMove)
		return {
			from: ret_move.substring(0, 2),
			to: ret_move.substring(2, 4),
			isCastling: isCastling,
			promotedPiece: promotedPiece,
			move: bestMove,
			enPass: enPass
		}
	}

	GetBestScore() {
		return this.SearchController.bestScore
	}
}
