import { NOMOVE, BOOL, PVENTRIES } from "./defs.js"

export function GetPvLine(depth) {
	let move = this.ProbePvTable()
	let count = 0

	while (move !== NOMOVE && count < depth) {
		if (this.GameBoard.MoveExists(move) === BOOL.TRUE) {
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

export function ProbePvTable() {
	let index = this.GameBoard.posKey % PVENTRIES

	if (this.GameBoard.m_PvTable[index].posKey === this.GameBoard.posKey) {
		return this.GameBoard.m_PvTable[index].move
	}

	return NOMOVE
}

export function StorePvMove(move) {
	let index = this.GameBoard.posKey % PVENTRIES
	this.GameBoard.m_PvTable[index].posKey = this.GameBoard.posKey
	this.GameBoard.m_PvTable[index].move = move
}
