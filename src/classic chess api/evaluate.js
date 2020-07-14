import {COLOURS, PIECES, PCEINDEX, SQ64, MIRROR64 } from "./defs.js"

// Piece Value Tables

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


export function EvalPosition () {
	let score =
		this.GameBoard.material[COLOURS.WHITE] - this.GameBoard.material[COLOURS.BLACK];

	let pce;
	let sq;
	let pceNum;

	//Pawn Table
	pce = PIECES.wP;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += this.PawnTable[SQ64(sq)];
	}

	pce = PIECES.bP;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= this.PawnTable[MIRROR64(SQ64(sq))];
	}

	//Knight Table
	pce = PIECES.wN;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += this.KnightTable[SQ64(sq)];
	}

	pce = PIECES.bN;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= this.KnightTable[MIRROR64(SQ64(sq))];
	}

	//Bishop Table
	pce = PIECES.wB;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += this.BishopTable[SQ64(sq)];
	}

	pce = PIECES.bB;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= this.BishopTable[MIRROR64(SQ64(sq))];
	}

	// Rook Table
	pce = PIECES.wR;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += this.RookTable[SQ64(sq)];
	}

	pce = PIECES.bR;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= this.RookTable[MIRROR64(SQ64(sq))];
	}

	// Queen Table
	pce = PIECES.wQ;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score += this.RookTable[SQ64(sq)];
	}

	pce = PIECES.bQ;
	for (pceNum = 0; pceNum < this.GameBoard.pceNum[pce]; pceNum++) {
		sq = this.GameBoard.pList[PCEINDEX(pce, pceNum)];
		score -= this.RookTable[MIRROR64(SQ64(sq))];
	}

	if (this.GameBoard.pceNum[PIECES.wB] >= 2) {
		score += this.BishopPair;
	}

	if (this.GameBoard.pceNum[PIECES.bB] >= 2) {
		score -= this.BishopPair;
	}

	if (this.GameBoard.side == COLOURS.WHITE) {
		return score;
	} else {
		return -score;
	}
};