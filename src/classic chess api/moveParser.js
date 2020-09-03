/**/
/* 
	 * FILE DESCRIPTION: 
	 * This file contains functions that give friendly functions through which the user does not need
	 * to know the fancy bitwise operations that is going on under the hood and use human readable strings
	 * perform actions and check the status of the move.
	 * 
*/
/**/
import { PIECES, NOMOVE, FROMSQ, TOSQ, PROMOTED, COLOURS, MFLAGCA, MFLAGEP} from "./defs.js"







 /**/
/*
NAME : GameBoard.GetMoveStatus() - Details the status of the move given the from and to squares.

SYNOPSIS : GetMoveStatus(a_from, a_to)
			a_from -> The sting from square. e.g 'a2'
			a_to -> The string to sqaure. e.g 'f3'

DESCRIPTION 
			Checks the status of the move given the from and to squares.
			Checks if there were any errors during the initializations.
			Useful for seeing if there was any bug during implementation.

RETURNS : an object detailing the status of the move.
			It gives the following information:
				- is the move valid,
				- is the move a castle move
				- is the move a promotion move.

AUTHOR : Srijan Prasad Joshi

DATE : 08/11/2020

*/
/**/
export function GetMoveStatus (a_from, a_to) {
	this.GenerateMoves() 
	a_from = (a_from.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (a_from.charCodeAt(1) - '0'.charCodeAt(0) - 1))
	a_to = (a_to.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (a_to.charCodeAt(1) - '0'.charCodeAt(0) - 1))

	let Move = NOMOVE
	let found = false
	let index

	for (index = this.m_moveListStart[this.m_ply]; index < this.m_moveListStart[this.m_ply + 1]; index++) {
		Move = this.m_moveList[index]
		if (FROMSQ(Move) === a_from && TOSQ(Move) === a_to) {
			found = true
			break
		}
	}

	if (found !== false) {
		// Check if king is in check after making the move as
		// generateMove() will generate moves in which checks is not considered 
		if (this.MakeMove(Move) === false) {
			return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0, promotion_move : false}

		}
		// revert the move from makeMove(Move)
		this.TakeMove()
		return {isValidMove : true, castle_move: (Move & MFLAGCA) !== 0, promotion_move : (PROMOTED(Move) !== PIECES.EMPTY), enPass_move: ((Move & MFLAGEP) !==0)}

	}

	return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0, promotion_move : false, enPass_move: ((Move & MFLAGEP) !==0)}
}
/* GetMoveStatus(a_from, a_to) */







 /**/
/*
NAME : GameBoard.MovePieceUsingStandardLocations() - Makes the move on the board using string location.

SYNOPSIS : MovePieceUsingStandardLocations(a_from, a_to, a_promoted = PIECES.EMPTY)
			a_from -> The sting from square.
			a_to -> The string to sqaure.
			a_promoted -> The number representing which piece promotion is the move leading to. Default will
							be PIECES.EMPTY if move is not a promotion move.

DESCRIPTION 
			Makes the move on the board using string location.
			Example of a location is 'a1' or 'f5'.

RETURNS : an object detailing the status of the move.
			It gives the following information:
				- is the move valid,
				- is the move a castle move

AUTHOR : Srijan Prasad Joshi

DATE : 08/11/2020

*/
/**/
export function MovePieceUsingStandardLocations(a_from, a_to, a_promoted = PIECES.EMPTY) {
		this.GenerateMoves() 
		a_from = (a_from.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (a_from.charCodeAt(1) - '0'.charCodeAt(0) - 1))
		a_to = (a_to.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (a_to.charCodeAt(1) - '0'.charCodeAt(0) - 1))
		
		let Move = NOMOVE
		let PromPce = PIECES.EMPTY
		let found = false
		let index
	
		for (index = this.m_moveListStart[this.m_ply]; index < this.m_moveListStart[this.m_ply + 1]; index++) {
			Move = this.m_moveList[index]
			if (FROMSQ(Move) === a_from && TOSQ(Move) === a_to) {
				// Check for piece promotion if the from and to square satisfy
				PromPce = PROMOTED(Move)
				if (a_promoted !== PIECES.EMPTY) {
					if(PromPce === a_promoted){
							if (this.m_side === COLOURS.WHITE) {
								if (PromPce === PIECES.wQ || PromPce === PIECES.wR || PromPce === PIECES.wB || PromPce === PIECES.wN) {
								found = true
								break
							}
						} else {
							if (PromPce === PIECES.bQ || PromPce === PIECES.bR || PromPce === PIECES.bB || PromPce === PIECES.bN) {
								found = true
								break
							}
						}
					} else {
						continue
					}
				}
				found = true
				break
			}
		}
	
		if (found !== false) {
			// Check if king is in check after making the move as
			// generateMove() will generate moves in which checks is not considered 
			if (this.MakeMove(Move) === false) {
				return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0}
			}
			return {isValidMove : true, castle_move: (Move & MFLAGCA) !== 0}
		}

		return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0}
}
/* MovePieceUsingStandardLocations(a_from, a_to, a_promoted = PIECES.EMPTY) */
