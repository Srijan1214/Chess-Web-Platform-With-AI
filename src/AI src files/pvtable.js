/**/
/* 
	 * FILE DESCRIPTION: 
	 * Contains functions to implement the Principle Variation Table move order optimization method.
	 * The Principle variation table basically tells the AI at a certain depth to start its min-max search
	 * from what it considered the best lines until the previous depth.
	 * For example the best moves calculated 4 moves deep will likely be the best move till 5 moves deep.
	 * This usually increases the AI speed by a factor of 2-5.
*/
/**/
import { NOMOVE, PVENTRIES } from "../classic chess api/defs.js"







 /**/
/*
NAME : GameBoard.GetPvLine() - Enters the best line evaluated up till a certain depth to the m_PvArray.

SYNOPSIS : GetPvLine(a_depth)
			a_depth -> The depth till which to search starting from the current position.

DESCRIPTION 
			Enters the best line evaluated up till a certain depth to the m_PvArray.
			If the depth is greater than till what has been evaluated then it only goes till the max depth.

RETURNS : How long the principle variation line actually is. If a_depth <= the depth till what was previously
			calculated by the engine, then this number will be equal to a_depth. Else, it will be the depth 
			till what was actually calculated.

AUTHOR : Srijan Prasad Joshi

DATE : 08/06/2020

*/
/**/
export function GetPvLine(a_depth) {
	let move = this.ProbePvTable()
	let count = 0

	while (move !== NOMOVE && count < a_depth) {
		if (this.GameBoard.MoveExists(move) === true) {
			this.GameBoard.MakeMove(move)
			this.GameBoard.m_PvArray[count++] = move
		} else {
			break
		}
		move = this.ProbePvTable()
	}

	while (this.GameBoard.m_ply > 0) {
		this.GameBoard.TakeMove()
	}

	return count
}
/* GetPvLine(a_depth) */







 /**/
/*
NAME : GameBoard.ProbePvTable() - Returns the best move if the current position has already been analyzed.

SYNOPSIS : ProbePvTable()

DESCRIPTION 
			Returns the best move if the current position has already been analyzed.
			Searches the m_PvTable for the best move of the current position.

RETURNS : The best move that gotten from previous analysis. Returns NOMOVE if the postions hasn't been
			reached in the previous calculations.

AUTHOR : Srijan Prasad Joshi

DATE : 08/06/2020

*/
/**/
export function ProbePvTable() {
	let index = this.GameBoard.posKey % PVENTRIES

	if (this.GameBoard.m_PvTable[index].posKey === this.GameBoard.posKey) {
		return this.GameBoard.m_PvTable[index].move
	}

	return NOMOVE
}
/* ProbePvTable() */







 /**/
/*
NAME : GameBoard.StorePvMove() - Stores the move along with the position key in the principle variation table.

SYNOPSIS : StorePvMove(a_move)
			a_move -> The 32 bit move number encapsulating all the information needed for a chess move.

DESCRIPTION 
			Stores the move along with the position key in the principle variation table.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 08/06/2020

*/
/**/
export function StorePvMove(a_move) {
	let index = this.GameBoard.posKey % PVENTRIES
	this.GameBoard.m_PvTable[index].posKey = this.GameBoard.posKey
	this.GameBoard.m_PvTable[index].move = a_move
}
/* StorePvMove(a_move) */
