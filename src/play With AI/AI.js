import * as Chess from "chess.js"
import _ from "lodash"
import { convert_fileRank_to_rowCol, convert_rowCol_to_fileRank } from "../utility_functions/Utility"
let chess = new Chess()
let cur_position = ''

export const initialize_chess = (chess_obj) => {
	chess = chess_obj
}

export const initialize_position = (position) => {
	cur_position = position
}

export function give_a_move(board_arr, isWhiteTurn) {
	const depth = 3
	let min_eval = 100000 // a very large eval
	let best_move = {}
	convert_board_to_ascii(board_arr, isWhiteTurn)
	const legal_moves = chess.moves({ verbose: true })
	for(let move of legal_moves){
		const new_board = makeMove(move.from, move.to, board_arr)
		const pos_evaluation = bfs_until_required_depth(new_board, !isWhiteTurn, depth, depth)
		if(pos_evaluation < min_eval){
			min_eval = pos_evaluation
			best_move = move
		}
	}
	return best_move
}

function bfs_until_required_depth(board_arr, isWhiteTurn, required_depth, cur_depth) {
	if(cur_depth === 0) return immediate_position_eval(board_arr, isWhiteTurn)
	convert_board_to_ascii(board_arr, isWhiteTurn)
	let min_eval = 100000 // a very large eval
	const legal_moves = chess.moves({ verbose: true })
	for(let move of legal_moves){
		const new_board = makeMove(move.from, move.to, board_arr)
		min_eval = Math.min(bfs_until_required_depth(new_board, !isWhiteTurn, required_depth, cur_depth - 1), min_eval)
	}
	convert_board_to_ascii(board_arr, isWhiteTurn)
	return min_eval
}

const immediate_position_eval = (board_arr, isWhiteTurn) => {
	convert_board_to_ascii(board_arr, isWhiteTurn)
	if (chess.in_checkmate()) {
		return (isWhiteTurn ? 10000 : -10000)
	}
	if (chess.in_draw()) {
		return 0
	}
	let pos_eval = 0
	for (let r = 0; r < 8; r++) {
		for (let c = 0; c < 8; c++) {
			if (board_arr[r][c] === 1) {
				pos_eval += 1
			} else if (board_arr[r][c] === 3) {
				pos_eval += 3
			} else if (board_arr[r][c] === 3.5) {
				pos_eval += 3.5
			} else if (board_arr[r][c] === 4) {
				pos_eval += 4
			} else if (board_arr[r][c] === 5) {
				pos_eval += 5
			} else if (board_arr[r][c] === 9) {
				pos_eval += 9
			} else if (board_arr[r][c] === 11) {
				pos_eval -= 1
			} else if (board_arr[r][c] === 13) {
				pos_eval -= 3
			} else if (board_arr[r][c] === 13.5) {
				pos_eval -= 3.5
			} else if (board_arr[r][c] === 14) {
				pos_eval -= 4
			} else if (board_arr[r][c] === 15) {
				pos_eval -= 5
			} else if (board_arr[r][c] === 19) {
				pos_eval -= 9
			}
		}
	}
	return pos_eval
}

const convert_board_to_ascii = (board_arr, isWhiteTurn) => {
	const turn_string = isWhiteTurn ? 'w' : 'b'
	const initial_fen = "8/8/8/8/8/8/8/8 " + turn_string + " - - 0 1"
	chess.load(initial_fen)
	for (let r = 0; r < 8; r++) {
		for (let c = 0; c < 8; c++) {
			const put_obj = { type: '', color: '' }
			const ele = board_arr[r][c]
			const location = convert_rowCol_to_fileRank(r, c)
			if (ele === 0) {
				chess.remove(location)
				continue
			} else if (ele > 0 && ele < 10) {
				put_obj.color = 'w'
			} else if (ele > 10) {
				put_obj.color = 'b'
			}
			if (ele === 1 || ele === 11) {
				put_obj.type = chess.PAWN
			} else if (ele === 3.5 || ele === 13.5) {
				put_obj.type = chess.BISHOP
			} else if (ele === 3 || ele === 13) {
				put_obj.type = chess.KNIGHT
			} else if (ele === 5 || ele === 15) {
				put_obj.type = chess.ROOK
			} else if (ele === 9 || ele === 19) {
				put_obj.type = chess.QUEEN
			} else if (ele === 4 || ele === 14) {
				put_obj.type = chess.KING
			}
			chess.put(put_obj, location)
		}
	}
}

const makeMove = (prev_location, new_location, board_arr) => {
	let prev_row = 8 - parseInt(prev_location[1])
	let prev_column = (prev_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

	let new_row = 8 - parseInt(new_location[1])
	let new_column = (new_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

	const temp = _.cloneDeep(board_arr)
	temp[new_row][new_column] = temp[prev_row][prev_column]
	temp[prev_row][prev_column] = 0
	return temp
}