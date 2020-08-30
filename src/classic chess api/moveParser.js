import { PIECES, NOMOVE, BOOL, FROMSQ, TOSQ, PROMOTED, COLOURS, MFLAGCA, MFLAGEP} from "./defs.js"

export function get_move_status (from, to) {
	// TODO
	this.GenerateMoves() // will be better if this is called before the check.
	from = (from.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (from.charCodeAt(1) - '0'.charCodeAt(0) - 1))
	to = (to.charCodeAt(0) - 'a'.charCodeAt(0) + 21 + 10 * (to.charCodeAt(1) - '0'.charCodeAt(0) - 1))

	let Move = NOMOVE
	let found = BOOL.FALSE
	let index

	for (index = this.moveListStart[this.ply]; index < this.moveListStart[this.ply + 1]; index++) {
		Move = this.moveList[index]
		if (FROMSQ(Move) === from && TOSQ(Move) === to) {
			found = true
			break
		}
	}

	if (found !== BOOL.FALSE) {
		// Check if king is in check after making the move as
		// generateMove() will generate moves in which checks is not considered 
		if (this.MakeMove(Move) === BOOL.FALSE) {
			return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0, promotion_move : false}

		}
		// revert the move from makeMove(Move)
		this.TakeMove()
		return {isValidMove : true, castle_move: (Move & MFLAGCA) !== 0, promotion_move : (PROMOTED(Move) !== PIECES.EMPTY), enPass_move: ((Move & MFLAGEP) !==0)}

	}

	return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0, promotion_move : false, enPass_move: ((Move & MFLAGEP) !==0)}
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
			if (FROMSQ(Move) === from && TOSQ(Move) === to) {
				// Check for piece promotion if the from and to square satisfy
				PromPce = PROMOTED(Move)
				if (promoted !== PIECES.EMPTY) {
					if(PromPce === promoted){
							if (this.side === COLOURS.WHITE) {
								if (PromPce === PIECES.wQ || PromPce === PIECES.wR || PromPce === PIECES.wB || PromPce === PIECES.wN) {
								found = BOOL.TRUE
								break
							}
						} else {
							if (PromPce === PIECES.bQ || PromPce === PIECES.bR || PromPce === PIECES.bB || PromPce === PIECES.bN) {
								found = BOOL.TRUE
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
	
		if (found !== BOOL.FALSE) {
			// Check if king is in check after making the move as
			// generateMove() will generate moves in which checks is not considered 
			if (this.MakeMove(Move) === BOOL.FALSE) {
				return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0}
			}
			return {isValidMove : true, castle_move: (Move & MFLAGCA) !== 0}
		}

		return {isValidMove : false, castle_move: (Move & MFLAGCA) !== 0}
}