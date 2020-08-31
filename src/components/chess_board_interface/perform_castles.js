import {
	Get_Black_King_Side_Castle_Array,
	Get_White_King_Side_Castle_Array,
	Get_Black_Queen_Side_Castle_Array,
	Get_White_Queen_Side_Castle_Array,
} from "../../utility_functions/Utility.js"

// the following functions clears all the pieces 
// in the way to allow for castlings

export function perform_white_king_side_castle() {
	const newState = {}
	newState.curPosition = Get_White_King_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}

export function perform_white_queen_side_castle() {
	const newState = {}
	newState.curPosition= Get_White_Queen_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}

export function perform_black_king_side_castle() {
	const newState = {}
	newState.curPosition = Get_Black_King_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}

export function perform_black_queen_side_castle() {
	const newState = {}
	newState.curPosition = Get_Black_Queen_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}