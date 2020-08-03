import React from "react"
import Board from "../components/chess_board/Board"
import _ from "lodash"
import * as Chess from "chess.js"
import { convert_fileRank_to_rowCol, convert_rowCol_to_fileRank } from "../utility_functions/Utility"
import { give_a_move } from "./AI"
import GameBoard from "../classic chess api/board.js"
import AI from "../classic chess api/search.js"
import GameBoardWrapper from "../components/chess_board/GameBoardWrapper"
import { COLOURS } from "../classic chess api/defs"

const chess = new Chess()

class PlayWithAIComponent extends React.Component {
	constructor(props) {
		super(props)
		this._board = React.createRef()
		this.user_color = 0 //make player only white for now
		this.GameBoard = new GameBoard()
		this.standard_ai = new AI(this.GameBoard)
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
				{/* <
					Board height={600} width={600} ref={this._board}
					callback_to_indicate_move_is_played={this.callback_to_indicate_move_is_played}
					get_move_status={this.get_move_status}
				/> */}
				<GameBoardWrapper height={600} width={600} ref={this._board}
					callback_to_indicate_move_is_played={this.callback_to_indicate_move_is_played}
					get_move_status={this.get_move_status}
				/>
			</div>
		)
	}

	getMoveFromAI = () => {
		const temp = _.cloneDeep(this._board.current._board.current.state.curPosition)
		// console.log(temp, chess.turn())
		// const move = give_a_move(temp, chess.turn() == 'w')
		const move = this.standard_ai.SearchPosition()
		return move
	}

	playMoveFromAI = () => {
		const move = this.getMoveFromAI()
		// chess.move(move)
		console.log(move)
		if(move.isCastling){
			if(move.to === 'g1') {
				this._board.current._board.current.perform_white_king_side_castle(this._board.current._board.current.state.curPosition)
			}else if (move.to === 'c1'){
				this._board.current._board.current.perform_white_queen_side_castle(this._board.current._board.current.state.curPosition)
			}else if (move.to === 'g8') {
				this._board.current._board.current.perform_black_king_side_castle(this._board.current._board.current.state.curPosition)
			}else if (move.to === 'c8'){
				this._board.current._board.current.perform_black_queen_side_castle(this._board.current._board.current.state.curPosition)
			}
		}else {
			this._board.current._board.current.makeMove(move.from, move.to)
		}
		this.GameBoard.MakeMove(move.move)
		this.GameBoard.PrintBoard()
	}

	callback_to_indicate_move_is_played = (prev_location, new_location) => {
		const moveStatus = this.GameBoard.move_piece(prev_location, new_location)
		this.GameBoard.PrintBoard()

		const { row: new_r, column: new_c } = convert_fileRank_to_rowCol(new_location)
		const { row: prev_r, column: prev_c } = convert_fileRank_to_rowCol(prev_location)

		const newPosition = _.cloneDeep(this.state.cur_position)
		newPosition[new_r][new_c] = newPosition[prev_r][prev_c]
		newPosition[prev_r][prev_c] = 0

		const newState = {}
		newState.who_moves = !this.state.who_moves
		newState.cur_position = newPosition
		this.setState(newState, () => {
			//Checks if Game Ends
			if(this.GameBoard.check_if_drawn_position()) {
				this._board.current.show_end_game_menu_bar()
				return
			}

			if(this.GameBoard.get_which_side_won() != COLOURS.NONE) {
				this._board.current.show_end_game_menu_bar()
				return
			}

			//creating timeout to make it asyncronous and not block the main program
			// TODO might user worker later but it is a big pain to implement.
			setTimeout(() => {
				this._board.current._board.current.block_user_input()
				this.playMoveFromAI()
				const newState = {}
				newState.who_moves = !this.state.who_moves
				this.setState(newState, () => {
					this._board.current._board.current.unblock_user_input()
					//Checks if Game Ends
					if(this.GameBoard.check_if_drawn_position()) {
						this._board.current.show_end_game_menu_bar()
					}

					if(this.GameBoard.get_which_side_won() != COLOURS.NONE) {
						this._board.current.show_end_game_menu_bar()
					}
				})
			}, 10)
		})
	}

	get_move_status = (prev_location, new_location) => {
		return this.GameBoard.get_move_status(prev_location, new_location)
	}
}

export default PlayWithAIComponent