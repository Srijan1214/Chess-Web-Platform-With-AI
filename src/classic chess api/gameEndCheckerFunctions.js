import { PIECES, BOOL, COLOURS, PCEINDEX, Kings } from "./defs.js"

export function check_if_draw_due_to_material() {
	if (this.pceNum[PIECES.wP] !== 0 || this.pceNum[PIECES.bP] !== 0)
		return BOOL.FALSE
	if (
		this.pceNum[PIECES.wQ] !== 0 ||
		this.pceNum[PIECES.bQ] !== 0 ||
		this.pceNum[PIECES.wR] !== 0 ||
		this.pceNum[PIECES.bR] !== 0
	)
		return BOOL.FALSE
	if (this.pceNum[PIECES.wB] > 1 || this.pceNum[PIECES.bB] > 1) {
		return BOOL.FALSE
	}
	if (this.pceNum[PIECES.wN] > 1 || this.pceNum[PIECES.bN] > 1) {
		return BOOL.FALSE
	}

	if (this.pceNum[PIECES.wN] !== 0 && this.pceNum[PIECES.wB] !== 0) {
		return BOOL.FALSE
	}
	if (this.pceNum[PIECES.bN] !== 0 && this.pceNum[PIECES.bB] !== 0) {
		return BOOL.FALSE
	}

	return BOOL.TRUE
}

// returns BOOL.FALSE if no stalemate
export function check_if_draw_due_to_stalemate() {
	this.GenerateMoves()

	let MoveNum = 0
	let found = 0

	for (
		MoveNum = this.moveListStart[this.m_ply];
		MoveNum < this.moveListStart[this.m_ply + 1];
		++MoveNum
	) {
		if (this.MakeMove(this.moveList[MoveNum]) === BOOL.FALSE) {
			continue
		}
		found++
		this.TakeMove()
		break
	}

	if (found !== 0) return BOOL.FALSE

	let InCheck = this.SqAttacked(
		this.pList[PCEINDEX(Kings[this.m_side], 0)],
		this.m_side ^ 1
	)

	if (InCheck === BOOL.TRUE) {
			return BOOL.FALSE
	} else {
		// stalemate
		return BOOL.TRUE
	}
}

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

export function check_if_drawn_position() {
	if (this.m_fiftyMove >= 100) {
		return BOOL.TRUE
	}

	if (this.ThreeFoldRep() >= 2) {
		return BOOL.TRUE
	}

	if (this.check_if_draw_due_to_material() === BOOL.TRUE) {
		return BOOL.TRUE
	}

	if (this.check_if_draw_due_to_stalemate() === BOOL.TRUE) {
		return BOOL.TRUE
	}
	return BOOL.FALSE
}

// returns COLORS.NONE if no side is winning
export function get_which_side_won() {
	this.GenerateMoves()

	let MoveNum = 0
	let found = 0

	for (
		MoveNum = this.moveListStart[this.m_ply];
		MoveNum < this.moveListStart[this.m_ply + 1];
		++MoveNum
	) {
		if (this.MakeMove(this.moveList[MoveNum]) === BOOL.FALSE) {
			continue
		}
		found++
		this.TakeMove()
		break
	}

	if (found !== 0) return COLOURS.NONE

	let InCheck = this.SqAttacked(
		this.pList[PCEINDEX(Kings[this.m_side], 0)],
		this.m_side ^ 1
	)

	if (InCheck === BOOL.TRUE) {
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