import React from "react"
import _ from "lodash"
import { convert_fileRank_to_rowCol, convert_rowCol_to_fileRank, get_flipped_square } from "../utility_functions/Utility"
import GameBoard from "../classic chess api/board.js"
import AI from "../classic chess api/search.js"
import GameBoardWrapper from "../components/chess_board/GameBoardWrapper"
import { COLOURS, PIECES } from "../classic chess api/defs"


class PlayWithAIComponent extends React.Component {
	constructor(props) {
		super(props)
		this._board = React.createRef()
		this.user_color = 0 //make player only white for now
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
					callback_cancel_promotion_layout={this.callback_cancel_promotion_layout}
					callback_buttonclick_takeback={this.callback_buttonclick_takeback}
					callback_buttonclick_restart_game={this.callback_buttonclick_restart_game}
					get_move_status={this.get_move_status}
				/>
			</div>
		)
	}

	setFEN = (fenStr) => {
		this.GameBoard.ParseFen(fenStr)
		this.force_interface_sync_with_backend()
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
				if(this.user_color === 1) {
					file_number = 9 - file_number
				}
				this._board.current.show_promotion_selection_menu(file_number)
				const newState = {}
				newState.prev_location = prev_location
				newState.new_location = new_location
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

	callback_cancel_promotion_layout = () => {
		const pawn_val = (this.user_color === 0) ? 1 : 11
		const location_val_1 = {location: this.state.prev_location, value: pawn_val}
		const location_val_2 = {location: this.state.new_location, value: 0}

		this._board.current._board.current.put_multiple_pieces_on_board([location_val_1, location_val_2])
		this._board.current.hide_promotion_selection_menu()
	}

	callback_buttonclick_takeback = () => {
		this.GameBoard.TakeBack_Move()
		this.GameBoard.TakeBack_Move()
		this.force_interface_sync_with_backend()
	}

	callback_buttonclick_offer_draw = () => {

	}

	callback_buttonclick_resign = () => {

	}

	callback_buttonclick_restart_game = () => {
		this.GameBoard.Set_Board_To_Start_Position()
		this.force_interface_sync_with_backend()
	}

	callback_buttonclick_analyze = () => {

	}

	callback_buttonclick_home_page = () => {

	}

	// Makes the display chess board position match up to the position in the GameBoard logic
	force_interface_sync_with_backend() {
		const piece_character_array = this.GameBoard.GiveBoardArray()
		const location_val_array = []

		const get_piece_value_from_piece_character = function(piece_char) {
			switch(piece_char){
				case 'P': return 1
				case 'N': return 3
				case 'B': return 3.5
				case 'K': return 4
				case 'R': return 5
				case 'Q': return 9
				case 'p': return 11
				case 'n': return 13
				case 'b': return 13.5
				case 'k': return 14
				case 'r': return 15
				case 'q': return 19
				case '.': return 0
			}
			return -1
		}
		for(let r = 0; r < 8; r++) {
			for(let c = 0; c < 8; c++) {
				const location = convert_rowCol_to_fileRank(r, c)
				const value = get_piece_value_from_piece_character(piece_character_array[r][c])
				location_val_array.push({location: location, value: value})
			}
		}
		this._board.current._board.current.put_multiple_pieces_on_board(location_val_array)
	}

	componentDidMount() {
		// this.setFEN("rn1qk2r/p2nbppp/bpp1p3/3pN3/2PP4/1PB3P1/P3PPBP/RN1QK2R w KQkq - 2 10")
		if(this.user_color === 1) {
			this.playMoveFromAI()
		} else {

		}
	}
}

export default PlayWithAIComponent