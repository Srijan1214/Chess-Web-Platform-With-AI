/**/
/* 
	 * FILE DESCRIPTION:  These functions help in checking if the game has ended.
*/
/**/
import { PIECES, COLOURS, PCEINDEX, Kings } from "./defs.js"







 /**/
/*
NAME : GameBoard.CheckIfDrawDueToMaterial() - Checks if the game was draw due to material not being enough.

SYNOPSIS : CheckIfDrawDueToMaterial()

DESCRIPTION 
			Checks if there were any errors during the initializations.
			Useful for seeing if there was any bug during implementation.

RETURNS : true if draw. False if not.

AUTHOR : Srijan Prasad Joshi

DATE : 08/09/2020

*/
/**/
export function CheckIfDrawDueToMaterial() {
	if (this.m_pceNum[PIECES.wP] !== 0 || this.m_pceNum[PIECES.bP] !== 0)
		return false
	if (
		this.m_pceNum[PIECES.wQ] !== 0 ||
		this.m_pceNum[PIECES.bQ] !== 0 ||
		this.m_pceNum[PIECES.wR] !== 0 ||
		this.m_pceNum[PIECES.bR] !== 0
	)
		return false
	if (this.m_pceNum[PIECES.wB] > 1 || this.m_pceNum[PIECES.bB] > 1) {
		return false
	}
	if (this.m_pceNum[PIECES.wN] > 1 || this.m_pceNum[PIECES.bN] > 1) {
		return false
	}

	if (this.m_pceNum[PIECES.wN] !== 0 && this.m_pceNum[PIECES.wB] !== 0) {
		return false
	}
	if (this.m_pceNum[PIECES.bN] !== 0 && this.m_pceNum[PIECES.bB] !== 0) {
		return false
	}

	return true
}
/* CheckIfDrawDueToMaterial()*/







 /**/
/*
NAME : GameBoard.CheckIfDrawDueToStalemate() - Checks if draw by stalemate.

SYNOPSIS : CheckIfDrawDueToStalemate()

DESCRIPTION 
			Checks if draw by stalemate.

RETURNS : true if draw. False if not.

AUTHOR : Srijan Prasad Joshi

DATE : 08/09/2020

*/
/**/
export function CheckIfDrawDueToStalemate() {
	this.GenerateMoves()

	let MoveNum = 0
	let found = 0

	for (
		MoveNum = this.m_moveListStart[this.m_ply];
		MoveNum < this.m_moveListStart[this.m_ply + 1];
		++MoveNum
	) {
		if (this.MakeMove(this.m_moveList[MoveNum]) === false) {
			continue
		}
		found++
		this.TakeMove()
		break
	}

	if (found !== 0) return false

	let InCheck = this.SqAttacked(
		this.m_pList[PCEINDEX(Kings[this.m_side], 0)],
		this.m_side ^ 1
	)

	if (InCheck === true) {
			return false
	} else {
		// stalemate
		return true
	}
}
/* CheckIfDrawDueToStalemate()*/







 /**/
/*
NAME : GameBoard.ThreeFoldRep() - Checks if draw by threefold.

SYNOPSIS : ThreeFoldRep()

DESCRIPTION 
			Checks if draw by threefold.

RETURNS : true if draw. False if not.

AUTHOR : Srijan Prasad Joshi

DATE : 08/09/2020

*/
/**/
export function ThreeFoldRep() {
	let index = 0
	let repetitions = 0

	for (index = 0; index < this.m_hisPly; index++) {
		if (this.m_history[index].posKey === this.posKey) {
			repetitions++
		}
	}
	return repetitions
}
/* ThreeFoldRep()*/







 /**/
/*
NAME : GameBoard.CheckIfDrawnPosition() - Checks if the current position is drawn.

SYNOPSIS : CheckIfDrawnPosition()

DESCRIPTION 
			Calls the other function to check if the current position is a draw.

RETURNS : true if draw. False if not.

AUTHOR : Srijan Prasad Joshi

DATE : 08/09/2020

*/
/**/
export function CheckIfDrawnPosition() {
	if (this.m_fiftyMove >= 100) {
		return true
	}

	if (this.ThreeFoldRep() >= 2) {
		return true
	}

	if (this.CheckIfDrawDueToMaterial() === true) {
		return true
	}

	if (this.CheckIfDrawDueToStalemate() === true) {
		return true
	}
	return false
}
/* CheckIfDrawnPosition()*/







 /**/
/*
NAME : GameBoard.GetWhichSideWon() - Tells which side won the game.

SYNOPSIS : GetWhichSideWon()

DESCRIPTION 
			Tells which side won the game.
			If no side won, COLORS.NONE is returned.


RETURNS : The color of the winning side. If no side won, COLORS.none is returned.

AUTHOR : Srijan Prasad Joshi

DATE : 08/12/2020

*/
/**/
export function GetWhichSideWon() {
	this.GenerateMoves()

	let MoveNum = 0
	let found = 0

	for (
		MoveNum = this.m_moveListStart[this.m_ply];
		MoveNum < this.m_moveListStart[this.m_ply + 1];
		++MoveNum
	) {
		if (this.MakeMove(this.m_moveList[MoveNum]) === false) {
			continue
		}
		found++
		this.TakeMove()
		break
	}

	if (found !== 0) return COLOURS.NONE

	let InCheck = this.SqAttacked(
		this.m_pList[PCEINDEX(Kings[this.m_side], 0)],
		this.m_side ^ 1
	)

	if (InCheck === true) {
		if (this.m_side === COLOURS.WHITE) {
			// black wins
			return COLOURS.BLACK
		} else {
			// white wins
			return COLOURS.WHITE
		}
	} else {
		// stalemate
		return COLOURS.NONE
	}
}
/* GetWhichSideWon()*/
