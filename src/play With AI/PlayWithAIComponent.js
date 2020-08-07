import React from "react"
import _ from "lodash"
import { convert_fileRank_to_rowCol, get_flipped_square } from "../utility_functions/Utility"
import GameBoard from "../classic chess api/board.js"
import AI from "../classic chess api/search.js"
import GameBoardWrapper from "../components/chess_board/GameBoardWrapper"
import { COLOURS, PIECES } from "../classic chess api/defs"


class PlayWithAIComponent extends React.Component {
	constructor(props) {
		super(props)
		this._board = React.createRef()
		this.user_color = 1 //make player only white for now
		this.GameBoard = new GameBoard()
		this.standard_ai = new AI(this.GameBoard)
		this.state = {
			who_moves: this.user_color, // which color's turn is it right now
			should_block_all_user_moves: false,
			cur_position: [
				[15, 13, 13.5, 19, 14, 13.5, 13, 15],
				[11, 11, 11, 11, 11, 11, 11, 11],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 1, 1, 1, 1, 1, 1],
				[5, 3, 3.5, 9, 4, 3.5, 3, 5]],
			prev_location: "a1",
			new_location: "a1"
		}
	}
	render() {
		return (
			<div>
				<GameBoardWrapper height={600} width={600} ref={this._board}
					user_color={this.user_color}
					callback_to_indicate_move_is_played={this.callback_to_indicate_move_is_played}
					callback_insert_promotion_piece={this.callback_insert_promotion_piece}
					get_move_status={this.get_move_status}
				/>
			</div>
		)
	}

	getMoveFromAI = () => {
		const move = this.standard_ai.SearchPosition()
		return move
	}

	playMoveFromAI = () => {
		const move = this.getMoveFromAI()
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
		} else if (move.promotedPiece !== PIECES.EMPTY) {
			this._board.current._board.current.makeMove(move.from, move.to)
			let piece_val = 0
			if (move.promotedPiece === PIECES.wQ) piece_val = 9
			else if (move.promotedPiece === PIECES.wR) piece_val = 5
			else if (move.promotedPiece === PIECES.wB) piece_val = 3.5
			else if (move.promotedPiece === PIECES.wN) piece_val = 3
			else if (move.promotedPiece === PIECES.bQ) piece_val = 19
			else if (move.promotedPiece === PIECES.bR) piece_val = 15
			else if (move.promotedPiece === PIECES.bB) piece_val = 13.5
			else if (move.promotedPiece === PIECES.bN) piece_val = 13
			this._board.current._board.current.put_piece_on_board(move.to, piece_val)
		}else {
			this._board.current._board.current.makeMove(move.from, move.to)
		}
		this.GameBoard.MakeMove(move.move)
		this.GameBoard.PrintBoard()
	}

	//this function blocks user input while AI is processing
	perform_AI_move_blocking = () => {
		//Checks if Game Ends
		if(this.GameBoard.check_if_drawn_position()) {
			this._board.current.show_end_game_menu_bar()
			return
		}

		if(this.GameBoard.get_which_side_won() !== COLOURS.NONE) {
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

				if(this.GameBoard.get_which_side_won() !== COLOURS.NONE) {
					this._board.current.show_end_game_menu_bar()
				}
			})
		}, 10)
	}

	callback_to_indicate_move_is_played = (prev_location, new_location) => {
		const moveStatus = this.GameBoard.get_move_status(prev_location, new_location)
		if(moveStatus.isValidMove){
			if(moveStatus.castle_move) {
				if(new_location === 'g1') {
					this._board.current._board.current.perform_white_king_side_castle(this._board.current._board.current.state.curPosition)
				}else if (new_location === 'c1'){
					this._board.current._board.current.perform_white_queen_side_castle(this._board.current._board.current.state.curPosition)
				}else if (new_location === 'g8') {
					this._board.current._board.current.perform_black_king_side_castle(this._board.current._board.current.state.curPosition)
				}else if (new_location === 'c8'){
					this._board.current._board.current.perform_black_queen_side_castle(this._board.current._board.current.state.curPosition)
				}
			}
			if(moveStatus.promotion_move) {
				let file_number = parseInt(new_location.charCodeAt(0)) - 96
				if(this.user_color == 1) {
					file_number = 9 - file_number
				}
				this._board.current.show_promotion_selection_menu(file_number)
				const newState = {}
				newState.prev_location = prev_location
				newState.new_location = new_location
				// if (this.user_color === 1) {
				// 	newState.prev_location = get_flipped_square(newState.prev_location)
				// 	newState.new_location = get_flipped_square(newState.new_location)
				// }
				this.setState(newState)
				return
			}
			this.GameBoard.move_piece(prev_location, new_location)
		}
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
			this.perform_AI_move_blocking()
		})
	}

	get_move_status = (prev_location, new_location) => {
		return this.GameBoard.get_move_status(prev_location, new_location)
	}

	callback_insert_promotion_piece = (piece_val, file_number) => {
		let location = String.fromCharCode(97 + file_number - 1) + 8
		if(this.user_color === 1) { // if black's turn then location is 1st rank
			location = get_flipped_square(location)
		}
		this._board.current._board.current.put_piece_on_board(
			location,
			piece_val
		)

		let promPiece
		if (piece_val === 9) promPiece = PIECES.wQ
		else if (piece_val === 5) promPiece = PIECES.wR
		else if (piece_val === 3.5) promPiece = PIECES.wB
		else if (piece_val === 3) promPiece = PIECES.wN
		else if (piece_val === 19) promPiece = PIECES.bQ
		else if (piece_val === 15) promPiece = PIECES.bR
		else if (piece_val === 13.5) promPiece = PIECES.bB
		else if (piece_val === 13) promPiece = PIECES.bN

		this.GameBoard.move_piece(this.state.prev_location, this.state.new_location, promPiece)

		const newState = {}
		newState.who_moves = !this.state.who_moves
		this.setState(newState, () => {
			this.perform_AI_move_blocking()
		})

	}

	componentDidMount() {
		console.log(this._board.current)
		if(this.user_color === 1) {
			this.playMoveFromAI()
		} else {

		}
	}
}

export default PlayWithAIComponent