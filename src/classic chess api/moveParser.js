import { PIECES, NOMOVE, BOOL, FROMSQ, TOSQ, PROMOTED, COLOURS, MFLAGCA, } from "./defs.js"

export function get_move_status (from, to, promoted = PIECES.EMPTY) {
	// TODO
	this.GenerateMoves() // will be better if this is called before the check.
	from = (from.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (from.charCodeAt(1) - '0'.charCodeAt(0) - 1))
	to = (to.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (to.charCodeAt(1) - '0'.charCodeAt(0) - 1))

	let Move = NOMOVE
	let PromPce = PIECES.EMPTY
	let found = BOOL.FALSE
	let index

	for (index = this.moveListStart[this.ply]; index < this.moveListStart[this.ply + 1]; index++) {
		Move = this.moveList[index]
		if (FROMSQ(Move) == from && TOSQ(Move) == to) {
			// Check for piece promotion if the from and to square satisfy
			PromPce = PROMOTED(Move)
			if (PromPce == promoted && promoted != PIECES.EMPTY) {
				if (this.side == COLOURS.WHITE) {
					if (PromPce in [PIECES.wQ, PIECES.wR, PIECES.wB, PIECES.wN]) {
						found = BOOL.TRUE
						break
					}
				} else {
					if (PromPce in [PIECES.bQ, PIECES.bR, PIECES.bB, PIECES.bN]) {
						found = BOOL.TRUE
						break
					}
				}
			}
			found = true
			break
		}
	}

	if (found != BOOL.FALSE) {
		// Check if king is in check after making the move as
		// generateMove() will generate moves in which checks is not considered 
		if (this.MakeMove(Move) == BOOL.FALSE) {
			return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0}

		}
		// revert the move from makeMove(Move)
		this.TakeMove()
		return {isValidMove : true, castle_move: (Move & MFLAGCA) !== 0}

	}

	return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0}
}

export function move_piece(from, to, promoted = PIECES.EMPTY) {
		// TODO
		this.GenerateMoves() // will be better if this is called before the check.
		from = (from.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (from.charCodeAt(1) - '0'.charCodeAt(0) - 1))
		to = (to.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (to.charCodeAt(1) - '0'.charCodeAt(0) - 1))
		
		let Move = NOMOVE
		let PromPce = PIECES.EMPTY
		let found = BOOL.FALSE
		let index
	
		for (index = this.moveListStart[this.ply]; index < this.moveListStart[this.ply + 1]; index++) {
			Move = this.moveList[index]
			if (FROMSQ(Move) == from && TOSQ(Move) == to) {
				// Check for piece promotion if the from and to square satisfy
				PromPce = PROMOTED(Move)
				if (PromPce == promoted && promoted != PIECES.EMPTY) {
					if (this.side == COLOURS.WHITE) {
						if (PromPce in [PIECES.wQ, PIECES.wR, PIECES.wB, PIECES.wN]) {
							found = BOOL.TRUE
							break
						}
					} else {
						if (PromPce in [PIECES.bQ, PIECES.bR, PIECES.bB, PIECES.bN]) {
							found = BOOL.TRUE
							break
						}
					}
				}
				found = true
				break
			}
		}
	
		if (found != BOOL.FALSE) {
			// Check if king is in check after making the move as
			// generateMove() will generate moves in which checks is not considered 
			if (this.MakeMove(Move) == BOOL.FALSE) {
				return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0}
			}
			return {isValidMove : true, castle_move: (Move & MFLAGCA) !== 0}
		}

		return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0}
}