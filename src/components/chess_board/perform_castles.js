import {
	convert_fileRank_to_rowCol,
	get_black_king_side_castle_array,
	get_white_king_side_castle_array,
	get_black_queen_side_castle_array,
	get_white_queen_side_castle_array,
} from "../../utility_functions/Utility.js"
import _ from "lodash"

// the following functions clears all the pieces 
// in the way to allow for castlings

export function perform_white_king_side_castle() {
	const newState = {}
	newState.curPosition = get_white_king_side_castle_array(this.state.curPosition)
	this.setState(newState)
}

export function perform_white_queen_side_castle() {
	const newState = {}
	newState.curPosition= get_white_queen_side_castle_array(this.state.curPosition)
	this.setState(newState)
}

export function perform_black_king_side_castle() {
	const newState = {}
	newState.curPosition = get_black_king_side_castle_array(this.state.curPosition)
	this.setState(newState)
}

export function perform_black_queen_side_castle() {
	const newState = {}
	newState.curPosition = get_black_queen_side_castle_array(this.state.curPosition)
	this.setState(newState)
}