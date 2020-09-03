/**/
/* 
	 * FILE DESCRIPTION:
	 * This file contains functions and arrays that facilitate in the static evaluation of the position.
	 * The static evaluation is basically telling how good a position is without any calculation.
	 * Uses simple arithmetic piece tables to do that.
	 * However, even though the evaluation is simple, this evaluation leads to a surprisingly strong engine.
*/
/**/
import {COLOURS, PIECES, PCEINDEX, SQ64, MIRROR64 } from "../classic chess api/defs.js"

// Piece Value Tables
// These tables tell how good a piece is at a particular position.

export const PawnTable = [
	0, 0, 0, 0, 0, 0, 0, 0,
	10, 10, 0, -10, -10, 0, 10, 10,
	5, 0, 0, 5, 5, 0, 0, 5,
	0, 0, 10, 20, 20, 10, 0, 0,
	5, 5, 5, 10, 10, 5, 5, 5,
	10, 10, 10, 20, 20, 10, 10, 10,
	20, 20, 20, 30, 30, 20, 20, 20,
	0, 0, 0, 0, 0, 0, 0, 0
]


export const KnightTable = [
	0, -10, 0, 0, 0, 0, -10, 0,
	0, 0, 0, 5, 5, 0, 0, 0,
	0, 0, 10, 10, 10, 10, 0, 0,
	0, 0, 10, 20, 20, 10, 5, 0,
	5, 10, 15, 20, 20, 15, 10, 5,
	5, 10, 10, 20, 20, 10, 10, 5,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0
]

export const BishopTable = [
	0, 0, -10, 0, 0, -10, 0, 0,
	0, 0, 0, 10, 10, 0, 0, 0,
	0, 0, 10, 15, 15, 10, 0, 0,
	0, 10, 15, 20, 20, 15, 10, 0,
	0, 10, 15, 20, 20, 15, 10, 0,
	0, 0, 10, 15, 15, 10, 0, 0,
	0, 0, 0, 10, 10, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0
]

export const RookTable = [
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	0, 0, 5, 10, 10, 5, 0, 0,
	25, 25, 25, 25, 25, 25, 25, 25,
	0, 0, 5, 10, 10, 5, 0, 0
]

export const BishopPair = 40








 /**/
/*
NAME : GameBoard.EvalPosition() - Gives the static evaluation of the position.

SYNOPSIS : EvalPosition()

DESCRIPTION 
			Gives the static evaluation of the position.
			First it looks at the material count.
			Then it adds the values of the piece table to the return value.
			Then it looks at forced check mates.
			Lastly, it considers a bishop pair advantage.

RETURNS : An integer in the range -30000 to 30000 to tell how good the current position 
			is for the current side.
			A score close to 30000 is completely winning, close to 0 is an even game and close to -30000 is
			completely loosing.

AUTHOR : Srijan Prasad Joshi

DATE : 08/06/2020

*/
/**/
export function EvalPosition () {
	let score =
		this.GameBoard.m_material[COLOURS.WHITE] - this.GameBoard.m_material[COLOURS.BLACK];

	let pce;
	let sq;
	let pceNum;

	//Pawn Table
	pce = PIECES.wP;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score += this.PawnTable[SQ64(sq)];
	}

	pce = PIECES.bP;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score -= this.PawnTable[MIRROR64(SQ64(sq))];
	}

	//Knight Table
	pce = PIECES.wN;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score += this.KnightTable[SQ64(sq)];
	}

	pce = PIECES.bN;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score -= this.KnightTable[MIRROR64(SQ64(sq))];
	}

	//Bishop Table
	pce = PIECES.wB;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score += this.BishopTable[SQ64(sq)];
	}

	pce = PIECES.bB;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score -= this.BishopTable[MIRROR64(SQ64(sq))];
	}

	// Rook Table
	pce = PIECES.wR;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score += this.RookTable[SQ64(sq)];
	}

	pce = PIECES.bR;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score -= this.RookTable[MIRROR64(SQ64(sq))];
	}

	// Queen Table
	pce = PIECES.wQ;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score += this.RookTable[SQ64(sq)];
	}

	pce = PIECES.bQ;
	for (pceNum = 0; pceNum < this.GameBoard.m_pceNum[pce]; pceNum++) {
		sq = this.GameBoard.m_pList[PCEINDEX(pce, pceNum)];
		score -= this.RookTable[MIRROR64(SQ64(sq))];
	}

	if (this.GameBoard.m_pceNum[PIECES.wB] >= 2) {
		score += this.BishopPair;
	}

	if (this.GameBoard.m_pceNum[PIECES.bB] >= 2) {
		score -= this.BishopPair;
	}

	if (this.GameBoard.m_side === COLOURS.WHITE) {
		return score;
	} else {
		return -score;
	}
};
/* EvalPosition() */
