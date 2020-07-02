import React from "react"
import Board from "../components/chess_board/Board"
import _ from "lodash"
import * as Chess from "chess.js"
import { convert_fileRank_to_rowCol, convert_rowCol_to_fileRank } from "../utility_functions/Utility"
import { give_a_move } from "./AI"
const chess = new Chess()

class PlayWithAIComponent extends React.Component {
	constructor(props) {
		super(props)
		this._board = React.createRef()
		this.user_color = 0 //make player only white for now
		this.state = {
			who_moves: 0, // which color's turn is it right now
			should_block_all_user_moves: false,
			cur_position: [
				[15, 13, 13.5, 19, 14, 13.5, 13, 15],
				[11, 11, 11, 11, 11, 11, 11, 11],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 1, 1, 1, 1, 1, 1],
				[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
		}
	}
	render() {
		return (
			<div>
				<
					Board height={600} width={600} ref={this._board}
					callback_to_indicate_move_is_played={this.callback_to_indicate_move_is_played}
					check_if_valid_move={this.check_if_valid_move}
				/>
			</div>
		)
	}

	getMoveFromAI = () => {
		const temp = _.cloneDeep(this._board.current.state.curPosition)
		console.log(temp, chess.turn())
		const move = give_a_move(temp, chess.turn() == 'w')
		return move
	}

	playMoveFromAI = () => {
		const move = this.getMoveFromAI()
		chess.move(move)
		console.log(move)
		this._board.current.makeMove(move.from, move.to)
	}

	callback_to_indicate_move_is_played = (prev_location, new_location) => {
		chess.move({ from: prev_location, to: new_location })
		console.log(chess.ascii())

		const { row: new_r, column: new_c } = convert_fileRank_to_rowCol(new_location)
		const { row: prev_r, column: prev_c } = convert_fileRank_to_rowCol(prev_location)

		const newPosition = _.cloneDeep(this.state.cur_position)
		newPosition[new_r][new_c] = newPosition[prev_r][prev_c]
		newPosition[prev_r][prev_c] = 0

		const newState = {}
		newState.who_moves = !this.state.who_moves
		if (this.state.who_moves !== this.user_color) {
			newState.should_block_all_user_moves = true
		} else {
			newState.should_block_all_user_moves = false
		}
		newState.cur_position = newPosition
		this.setState(newState, () => {
			setTimeout(() => {
				this.playMoveFromAI()
			}, 10)
		})
	}

	check_if_valid_move = (prev_location, new_location) => {
		if (prev_location === new_location) {
			return false
		}
		const valid_moves = chess.moves({ verbose: true })
		for (const ele of valid_moves) {
			if (ele.from == prev_location && ele.to == new_location) {
				return true
			}
		}
		return false
	}
}

export default PlayWithAIComponent