/**/
/* 
	 * FILE DESCRIPTION: 
	 * This file contains the AI class that contains all the logic to implement the AI using
	 * the alpha-beta search method and quiescence search. They utilize the evaluate function implemented in 
	 * the evaluate.js file.
*/
/**/
import * as eval_necessities from "./evaluate.js"
import * as pvtable_necessities from "./pvtable.js"
import {
	PVENTRIES,
	NOMOVE,
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
	MFLAGEP,
} from "../classic chess api/defs.js"

// The AI class containing all the functions needed for a chess AI.
export default class AI {
	 /**/
	/*
	NAME : GameBoard.constructor - Checks if there were any errors during the initializations.

	SYNOPSIS : GameBoard.constructor(GameBoard)
				GameBoard -> a GameBoard object gotten from the classic\ chess\ api/GameBoard class. This object
							is used to simulate the chess and an perform the alpha-beta search on its position.

	DESCRIPTION 
				Binds all the functions defined in other classes to the class. Also, binds the constant piece
				tables defined in evaluate.js.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/09/2020

	*/
	/**/
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
	/* .(GameBoard()()() */






	 /**/
	/*
	NAME : GameBoard.SetGameBoard() - Sets the member GameBoard object to the argument passed.

	SYNOPSIS : SetGameBoard(a_GameBoard)

	DESCRIPTION 
				Sets the member GameBoard object to the argument passed.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/18/2020

	*/
	/**/
	SetGameBoard(a_GameBoard) {
		this.GameBoard = a_GameBoard
	}
	/* SetGameBoard(a_GameBoard) */








	 /**/
	/*
	NAME : GameBoard.PickNextMove() - Puts the best move in the beginning of the m_moveList and m_moveScores array.

	SYNOPSIS : PickNextMove(a_move_number)
				a_move_number -> Index of the current best move inside the  m_moveList and m_moveScores array.

	DESCRIPTION 
				Puts the best move in the beginning of the m_moveList and m_moveScores array.
				This improves move ordering and speeds up the AI considerably. (approx. by a factor of 3-4)

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
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
			// swap the previously best score with the current move score in the m_moveScores array.
			let temp = this.GameBoard.m_moveScores[a_move_number]
			this.GameBoard.m_moveScores[a_move_number] = this.GameBoard.m_moveScores[bestNum]
			this.GameBoard.m_moveScores[bestNum] = temp

			// swap the previously best move with the current move move in the m_moveList array.
			temp = this.GameBoard.m_moveList[a_move_number]
			this.GameBoard.m_moveList[a_move_number] = this.GameBoard.m_moveList[bestNum]
			this.GameBoard.m_moveList[bestNum] = temp
		}
	}
	/* PickNextMove(a_move_number) */








	 /**/
	/*
	NAME : GameBoard.ClearPvTable() - Resets the principal variation table so that no moves are calculated.

	SYNOPSIS : ClearPvTable()

	DESCRIPTION 
				Resets the principal variation table so that no moves are calculated.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
	ClearPvTable() {
		let index

		for (index = 0; index < PVENTRIES; index++) {
			this.GameBoard.m_PvTable[index].move = NOMOVE
			this.GameBoard.m_PvTable[index].poskey = 0
		}
	}
	/* ClearPvTable() */








	 /**/
	/*
	NAME : GameBoard.CheckUp() - Stops the searching in the AI if it exceeds the time limit set.

	SYNOPSIS : CheckUp()

	DESCRIPTION 
				Stops the searching in the AI if it exceeds the time limit set.
				This is done by setting the SearchController.stop to true.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
	CheckUp() {
		if (
			Date.now() - this.SearchController.start >
			this.SearchController.time
		) {
			this.SearchController.stop = true
		}
	}
	/* CheckUp() */








	 /**/
	/*
	NAME : GameBoard.IsRepetition() - Checks if position is draw by repetition.

	SYNOPSIS : IsRepetition()

	DESCRIPTION 
				Checks if position is draw by repetition.

	RETURNS : True if game is a draw by repetition. False if no.

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
	IsRepetition() {
		let index = 0

		for (
			index = this.GameBoard.m_hisPly - this.GameBoard.m_fiftyMove;
			index < this.GameBoard.m_hisPly - 1;
			index++
		) {
			if (this.GameBoard.m_poskey === this.GameBoard.m_history[index].poskey) {
				return true
			}
		}
	}
	/* IsRepetition() */








	 /**/
	/*
	NAME : GameBoard.Quiescence() - Performs a shallow quiescence search on the position.

	SYNOPSIS : Quiescence(a_alpha, a_beta)
				a_alpha -> The alpha value evaluated till the current node in the alpha-beta tree.
				a_beta -> The beta value evaluated till the current node in the alpha-beta tree.

	DESCRIPTION 
				Performs a shallow quiescence search on the position.
				This search is called by the alpha-beta search in the leaf nodes.
				The quiescence search is better than using a raw evaluation function.
				This search just searches the volatile final positions a few moves more until the evaluation
				stabilizers. This type of search is rife in many board game AIs.
				https://en.wikipedia.org/wiki/Quiescence_search

	RETURNS : An integer value representing how good the quiescence search thinks the current position is.
				A large negative value means the position is bad for the side to move while a large positive
				value means that the position is good for the side to move.

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
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
			if (this.GameBoard.MakeMove(Move) === false) {
				continue
			}
			Legal++
			Score = -this.Quiescence(-a_beta, -a_alpha)

			this.GameBoard.TakeMove()

			if (this.SearchController.stop === true) {
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
	/* Quiescence(a_alpha, a_beta) */








	 /**/
	/*
	NAME : GameBoard.AlphaBeta() - Performs a standard alpha-beta pruning search on the current position.

	SYNOPSIS : AlphaBeta(a_alpha, a_beta, a_depth)
				a_alpha -> The alpha value evaluated till the current node in the alpha-beta tree.
				a_beta -> The beta value evaluated till the current node in the alpha-beta tree.
				a_depth -> The depth up till which to perform the alpha-beta search.

	DESCRIPTION 
				Performs a standard alpha-beta search on the current position.
				An alpha-beta search is the optimized version of the min-max search.
				In a min-max search, the algorithm searches each and every move, while in an alpha-beta
				search the algorithm will stop search a particular variation if it doesn't make any sense to
				look at this variation and other compelling variations were already searched.
				https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning


	RETURNS : An integer value representing how good the alpha-beta search thinks the current position is.
				A large negative value means the position is bad for the side to move while a large positive
				value means that the position is good for the side to move.

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
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
		if (InCheck === true) {
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
			if (this.GameBoard.MakeMove(Move) === false) {
				continue
			}
			Legal++
			Score = -this.AlphaBeta(-a_beta, -a_alpha, a_depth - 1)

			this.GameBoard.TakeMove()
			if (this.SearchController.stop === true) {
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
			if (InCheck === true) {
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
	/* AlphaBeta(a_alpha, a_beta, a_depth) */








	 /**/
	/*
	NAME : GameBoard.ClearForSearch() - Resets the necessary variables to start analyzing a position.

	SYNOPSIS : ClearForSearch()

	DESCRIPTION 
				Resets the necessary variables to start analyzing a position from scratch.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
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
		this.SearchController.stop = false
	}
	/* ClearForSearch() */








	 /**/
	/*
	NAME : GameBoard.SearchPosition() - Makes the AI search the position and give out the best move.

	SYNOPSIS : SearchPosition()

	DESCRIPTION 
				Makes the AI search the position and give out the best move.
				Executes the alpha-beta search on the position.

	RETURNS : An object giving all the details about the best move.
				The details are the move's from and to square in standard string format,
				weather the move is a castling move, promotion move or a capture move,
				the 32 bit number encapsulating the entire move.

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
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
			if (this.SearchController.stop === true) {
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
		this.SearchController.thinking = false
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
	/* SearchPosition() */








	 /**/
	/*
	NAME : GameBoard.GetBestScore() - Gets the latest score that the AI evaluated from the SearchPosition().

	SYNOPSIS : GetBestScore()

	DESCRIPTION 
				Gets the latest score that the AI evaluated from the SearchPosition().

	RETURNS : The position evaluation integer value.

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/11/2020

	*/
	/**/
	GetBestScore() {
		return this.SearchController.bestScore
	}
	/* GetBestScore() */
}
