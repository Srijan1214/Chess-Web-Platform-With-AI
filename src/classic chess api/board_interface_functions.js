import { START_FEN } from "./defs.js"

export function TakeBack_Move() {
	if(this.hisPly > 0) {
		this.TakeMove()
		this.ply = 0
	}
}

export function Set_Board_To_Start_Position() {
	this.ParseFen(START_FEN)
}