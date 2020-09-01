import React from "react"
import _ from "lodash"
import { Convert_FileRank_To_RowCol, Convert_RowCol_To_FileRank, Get_Flipped_Square } from "../../utility_functions/Utility"
import GameBoard from "../../classic chess api/board.js"
import AI from "../../AI src files/search.js"
import GameBoardInterfaceWrapper from "../../components/chess_board_interface/GameBoardInterfaceWrapper"
import { COLOURS, PIECES } from "../../classic chess api/defs"


class PlayWithAIComponent extends React.Component {
	constructor(props) {
		super(props)
		this._board = React.createRef()
		this.GameBoard = new GameBoard()
		this.standard_ai = new AI(this.GameBoard)
		this.state = {
			user_color: 0,
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
				[5, 3, 3.5, 9, 4, 3.5, 3, 5]],
			prev_location: "a1",
			new_location: "a1"
		}
	}
	callback_set_user_color = (a_user_color) => {
		const newState = {}
		newState.user_color = a_user_color
		this.setState(newState)
	}

	GetUserColor = () => {
		return this.state.user_color
	}

	render() {
		return (
			<div>
				<GameBoardInterfaceWrapper height={600} width={600} ref={this._board}
					user_color={this.state.user_color}
					GetUserColor={this.GetUserColor}
					CallbackToIndicateMoveIsPlayed={this.CallbackToIndicateMoveIsPlayed}
					CallbackInsertPromotionPiece={this.CallbackInsertPromotionPiece}
					CallbackCancelPromotionLayout={this.CallbackCancelPromotionLayout}
					CallbackButtonclickTakeback={this.CallbackButtonclickTakeback}
					CallbackButtonclickRestartGame={this.CallbackButtonclickRestartGame}
					CallbackButtonclickResign={this.CallbackButtonclickResign}
					CallbackButtonclickOfferDraw={this.CallbackButtonclickOfferDraw}
					callback_set_user_color={this.callback_set_user_color}
					GetMoveStatus={this.GetMoveStatus}
				/>
			</div>
		)
	}

	SetFEN = (a_fenStr) => {
		this.GameBoard.ParseFen(a_fenStr)
		this.ForceInterfaceSyncWithBackend()
	}

	GetMoveFromAI = () => {
		const move = this.standard_ai.SearchPosition()
		return move
	}

	PlayMoveFromAI = () => {
		const move = this.GetMoveFromAI()
		if(move.isCastling){
			if(move.to === 'g1') {
				this._board.current._board.current.PerformWhiteKingSideCastle(this._board.current._board.current.state.curPosition)
			}else if (move.to === 'c1'){
				this._board.current._board.current.PerformWhiteQueenSideCastle(this._board.current._board.current.state.curPosition)
			}else if (move.to === 'g8') {
				this._board.current._board.current.PerformBlackKingSideCastle(this._board.current._board.current.state.curPosition)
			}else if (move.to === 'c8'){
				this._board.current._board.current.PerformBlackQueenSideCastle(this._board.current._board.current.state.curPosition)
			}
		} else if (move.promotedPiece !== PIECES.EMPTY) {
			let piece_val = 0
			if (move.promotedPiece === PIECES.wQ) piece_val = 9
			else if (move.promotedPiece === PIECES.wR) piece_val = 5
			else if (move.promotedPiece === PIECES.wB) piece_val = 3.5
			else if (move.promotedPiece === PIECES.wN) piece_val = 3
			else if (move.promotedPiece === PIECES.bQ) piece_val = 19
			else if (move.promotedPiece === PIECES.bR) piece_val = 15
			else if (move.promotedPiece === PIECES.bB) piece_val = 13.5
			else if (move.promotedPiece === PIECES.bN) piece_val = 13
			const location_val_1 = {location: move.from, value: 0}
			const location_val_2 = {location: move.to, value: piece_val}
			this._board.current._board.current.PutMultiplePiecesOnBoard([location_val_1, location_val_2])
		}else if(move.enPass) {
			const piece_val = (this.GetUserColor() === 0)? 11: 1
			const location_val_1 = {location: move.from, value: 0}
			const location_val_2 = {location: move.to, value: piece_val}
			const location_val_3 = {location: move.to[0] + move.from[1], value: 0}
			this._board.current._board.current.PutMultiplePiecesOnBoard([location_val_1, location_val_2, location_val_3])
		} else {
			this._board.current._board.current.MovePieceInsideInterface(move.from, move.to)
		}
		this.GameBoard.MakeMove(move.move)
		this.GameBoard.PrintBoard()
	}

	//this function blocks user input while AI is processing
	// this also plays the ai move while checking if game ended
	PerformAIMoveBlocking = () => {
		//Checks if Game Ends
		if(this.GameBoard.CheckIfDrawnPosition()) {
			this._board.current.SetGameEndMessage("The Game Is A Draw!!!")
			this._board.current.ShowEndGameMenuBar()
			return
		}

		if(this.GameBoard.GetWhichSideWon() === COLOURS.WHITE) {
			this._board.current.SetGameEndMessage("WHITE WON!!!")
			this._board.current.ShowEndGameMenuBar()
			return
		}

		if(this.GameBoard.GetWhichSideWon() === COLOURS.BLACK) {
			this._board.current.SetGameEndMessage("BLACK WON!!!")
			this._board.current.ShowEndGameMenuBar()
			return
		}

		//creating timeout to make it asyncronous and not block the main program
		// TODO might user worker later but it is a big pain to implement.
		setTimeout(() => {
			this._board.current._board.current.BlockUserInput()
			this.PlayMoveFromAI()
			const newState = {}
			newState.who_moves = !this.state.who_moves
			this.setState(newState, () => {
				this._board.current._board.current.UnBlockUserInput()
				//Checks if Game Ends
				if(this.GameBoard.CheckIfDrawnPosition()) {
					this._board.current.SetGameEndMessage("The Game Is A Draw!!!")
					this._board.current.ShowEndGameMenuBar()
					return
				}

				if(this.GameBoard.GetWhichSideWon() === COLOURS.WHITE) {
					this._board.current.SetGameEndMessage("WHITE WON!!!")
					this._board.current.ShowEndGameMenuBar()
					return
				}

				if(this.GameBoard.GetWhichSideWon() === COLOURS.BLACK) {
					this._board.current.SetGameEndMessage("BLACK WON!!!")
					this._board.current.ShowEndGameMenuBar()
					return
				}
			})
		}, 10)
	}

	CallbackToIndicateMoveIsPlayed = (a_prev_location, a_new_location) => {
		const moveStatus = this.GameBoard.GetMoveStatus(a_prev_location, a_new_location)
		if(moveStatus.isValidMove){
			if(moveStatus.castle_move) {
				if(a_new_location === 'g1') {
					this._board.current._board.current.PerformWhiteKingSideCastle(this._board.current._board.current.state.curPosition)
				}else if (a_new_location === 'c1'){
					this._board.current._board.current.PerformWhiteQueenSideCastle(this._board.current._board.current.state.curPosition)
				}else if (a_new_location === 'g8') {
					this._board.current._board.current.PerformBlackKingSideCastle(this._board.current._board.current.state.curPosition)
				}else if (a_new_location === 'c8'){
					this._board.current._board.current.PerformBlackQueenSideCastle(this._board.current._board.current.state.curPosition)
				}
			}
			if(moveStatus.promotion_move) {
				let file_number = parseInt(a_new_location.charCodeAt(0)) - 96
				if(this.state.user_color === 1) {
					file_number = 9 - file_number
				}
				this._board.current.ShowPromotionSelectionMenu(file_number)
				const newState = {}
				newState.prev_location = a_prev_location
				newState.new_location = a_new_location
				this.setState(newState)
				return
			}
			if(moveStatus.enPass_move) {
				const file = a_new_location[0]
				const rank = a_prev_location[1]

				const location_val_1 = {location: file + rank, value: 0}
				this._board.current._board.current.PutMultiplePiecesOnBoard([location_val_1])

			}
			this.GameBoard.MovePieceStringLocations(a_prev_location, a_new_location)
		}
		this.GameBoard.PrintBoard()

		const { row: new_r, column: new_c } = Convert_FileRank_To_RowCol(a_new_location)
		const { row: prev_r, column: prev_c } = Convert_FileRank_To_RowCol(a_prev_location)

		const newPosition = _.cloneDeep(this.state.cur_position)
		newPosition[new_r][new_c] = newPosition[prev_r][prev_c]
		newPosition[prev_r][prev_c] = 0

		const newState = {}
		newState.who_moves = !this.state.who_moves
		newState.cur_position = newPosition
		this.setState(newState, () => {
			this.PerformAIMoveBlocking()
		})
	}

	GetMoveStatus = (a_prev_location, a_new_location) => {
		return this.GameBoard.GetMoveStatus(a_prev_location, a_new_location)
	}

	CallbackInsertPromotionPiece = (a_piece_val, a_file_number) => {
		let location = String.fromCharCode(97 + a_file_number - 1) + 8
		if(this.state.user_color === 1) { // if black's turn then location is 1st rank
			location = Get_Flipped_Square(location)
		}
		const location_val = {location: location, value: a_piece_val}
		this._board.current._board.current.PutMultiplePiecesOnBoard([location_val])

		let promPiece
		if (a_piece_val === 9) promPiece = PIECES.wQ
		else if (a_piece_val === 5) promPiece = PIECES.wR
		else if (a_piece_val === 3.5) promPiece = PIECES.wB
		else if (a_piece_val === 3) promPiece = PIECES.wN
		else if (a_piece_val === 19) promPiece = PIECES.bQ
		else if (a_piece_val === 15) promPiece = PIECES.bR
		else if (a_piece_val === 13.5) promPiece = PIECES.bB
		else if (a_piece_val === 13) promPiece = PIECES.bN

		this.GameBoard.MovePieceStringLocations(this.state.prev_location, this.state.new_location, promPiece)

		const newState = {}
		newState.who_moves = !this.state.who_moves
		this.setState(newState, () => {
			this.PerformAIMoveBlocking()
		})

	}

	CallbackCancelPromotionLayout = () => {
		const pawn_val = (this.state.user_color === 0) ? 1 : 11
		const location_val_1 = {location: this.state.prev_location, value: pawn_val}
		const location_val_2 = {location: this.state.new_location, value: 0}

		this._board.current._board.current.PutMultiplePiecesOnBoard([location_val_1, location_val_2])
		this._board.current.HidePromotionSelectionMenu()
	}

	CallbackButtonclickTakeback = () => {
		this.GameBoard.TakeBack_Move()
		this.GameBoard.TakeBack_Move()
		this.ForceInterfaceSyncWithBackend()
	}

	CallbackButtonclickOfferDraw = () => {
		let accept_draw = false

		if(this.standard_ai.GetBestScore() < -100) {
			accept_draw = true
		}

		if(accept_draw) {
			this._board.current.SetGameEndMessage("The Game Is A Draw!!!")
			this._board.current.ShowEndGameMenuBar()
		}
	}

	CallbackButtonclickResign = () => {
		let game_end_text
		if(this.state.user_color === 0) {
			game_end_text = "BLACK WINS"
		} else {
			game_end_text = "WHITE WINS"
		}

		this._board.current.SetGameEndMessage(game_end_text)
		this._board.current.ShowEndGameMenuBar()
	}

	CallbackButtonclickRestartGame = () => {
		const newState = {}
		newState.user_color = this._board.current.state.radio_button_user_color
		newState.who_moves = 0
		this.setState(newState, () =>  {
			this.GameBoard.Set_Board_To_Start_Position()
			this.ForceInterfaceSyncWithBackend()
			this._board.current.HideEndGameMenuBar()
			setTimeout(()=>{
				if(this.state.user_color === 1) {
					this.PlayMoveFromAI()
				}
			}, 10)
		})
	}

	// Makes the display chess board position match up to the position in the GameBoard logic
	ForceInterfaceSyncWithBackend() {
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
				default: return -1
			}
		}
		for(let row = 0; row < 8; row++) {
			for(let column = 0; column < 8; column++) {
				const location = Convert_RowCol_To_FileRank(row, column)
				const value = get_piece_value_from_piece_character(piece_character_array[row][column])
				location_val_array.push({location: location, value: value})
			}
		}
		this._board.current._board.current.PutMultiplePiecesOnBoard(location_val_array)
	}

	componentDidMount() {
		if(this.state.user_color === 1) {
			this.PlayMoveFromAI()
		} else {

		}
	}
}

export default PlayWithAIComponent