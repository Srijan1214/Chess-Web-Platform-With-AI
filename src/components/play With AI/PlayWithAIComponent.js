/**/
/* 
	 * FILE DESCRIPTION:
	 * This file contains the react component that facilitates a chess game with the AI.
	 * The class in this file is a react component that creates a div in which the chess game occurs. 
	 *
*/
/**/
import React from "react"
import _ from "lodash"
import { Convert_FileRank_To_RowCol, Convert_RowCol_To_FileRank, Get_Flipped_Square } from "../../utility_functions/Utility"
import GameBoard from "../../classic chess api/board.js"
import AI from "../../AI src files/search.js"
import GameBoardInterfaceWrapper from "../../components/chess_board_interface/GameBoardInterfaceWrapper"
import { COLOURS, PIECES } from "../../classic chess api/defs"

// Where the AlphaZero inference server (scripts/serve.py in Chess-Self-Play) runs.
const NEURAL_SERVER_URL =
	process.env.REACT_APP_NEURAL_SERVER_URL || "http://localhost:8000"
// PUCT simulations per neural move. Higher is stronger but slower.
const NEURAL_SIMULATIONS = 200


// The PlayWithAIComponent class definition.
class PlayWithAIComponent extends React.Component {
	constructor(props) {
		super(props)
		this._board = React.createRef()
		this.GameBoard = new GameBoard()
		this.standard_ai = new AI(this.GameBoard)
		this.state = {
			user_color: 0,
			opponent: "classic", // "classic" (alpha-beta) or "neural" (trained net)
			ai_thinking: false,
			neural_error: "",
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
			new_location: "a1",
			noOfFullMovesPlayed : 0,
		}
	}







	 /**/
	/*
	NAME : GameBoard.GetUserColor() - Gets the user.color stored in the state of this component.

	SYNOPSIS : GetUserColor()

	DESCRIPTION 
				Gets the user.color stored in the state of this component.

	RETURNS : 0 if the user if white. 1 if the user is black.

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/06/2020

	*/
	/**/
	GetUserColor = () => {
		return this.state.user_color
	}
	/* GetUserColor() */




	 /**/
	/*
	NAME : GameBoard.GetOpponent() - Gets the opponent type stored in state.

	SYNOPSIS : GetOpponent()

	DESCRIPTION
				Gets the opponent type stored in the state of this component.
				"classic" is the built-in alpha-beta AI, "neural" is the trained
				AlphaZero network served over HTTP.

	RETURNS : The opponent type string.

	AUTHOR : Srijan Prasad Joshi

	DATE : 10/04/2026

	*/
	/**/
	GetOpponent = () => {
		return this.state.opponent
	}
	/* GetOpponent() */




	 /**/
	/*
	NAME : GameBoard.CallbackSetOpponent() - Sets the opponent type.

	SYNOPSIS : CallbackSetOpponent(a_opponent)
				a_opponent -> The opponent to be set: "classic" or "neural".

	DESCRIPTION
				Sets the opponent state variable and clears any stale error text.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 10/04/2026

	*/
	/**/
	CallbackSetOpponent = (a_opponent) => {
		this.setState({ opponent: a_opponent, neural_error: "" })
	}
	/* CallbackSetOpponent(a_opponent) */







	 /**/
	/*
	NAME : GameBoard.render() - A standard  ReactJS render function.

	SYNOPSIS : render()

	DESCRIPTION 
				Renders the div with the board interface wrapper.
				Sets the height and width of the interface in pixels explicitly.

	RETURNS : A JSX div component with the appropriate properties.

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/13/2020

	*/
	/**/
	render() {
		return (
			<div>
				<GameBoardInterfaceWrapper height={this.props.height} width={this.props.width} ref={this._board}
					user_color={this.state.user_color}
					GetUserColor={this.GetUserColor}
					CallbackToIndicateMoveIsPlayed={this.CallbackToIndicateMoveIsPlayed}
					CallbackInsertPromotionPiece={this.CallbackInsertPromotionPiece}
					CallbackCancelPromotionLayout={this.CallbackCancelPromotionLayout}
					CallbackButtonclickTakeback={this.CallbackButtonclickTakeback}
					CallbackButtonclickRestartGame={this.CallbackButtonclickRestartGame}
					CallbackButtonclickResign={this.CallbackButtonclickResign}
					CallbackButtonclickOfferDraw={this.CallbackButtonclickOfferDraw}
					CallbackSetUserColor={this.CallbackSetUserColor}
					GetMoveStatus={this.GetMoveStatus}
					GetOpponent={this.GetOpponent}
					CallbackSetOpponent={this.CallbackSetOpponent}
				/>
				<div style={{ marginTop: "8px", color: "grey" }}>
					{this.state.opponent === "neural" && this.state.ai_thinking
						? "Neural net is thinking..."
						: ""}
					{this.state.neural_error
						? " " + this.state.neural_error
						: ""}
				</div>
			</div>
		)
	}
	/* render() */







	 /**/
	/*
	NAME : GameBoard.SetFEN() - Sets the interface and the chess game logic to the position in the fen string.

	SYNOPSIS : SetFEN(a_fenStr)
				a_fenStr -> A standard fen string that describes the position.

	DESCRIPTION 
				Sets the interface and the chess game logic to the position in the fen string.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/13/2020

	*/
	/**/
	SetFEN = (a_fenStr) => {
		this.GameBoard.ParseFen(a_fenStr)
		this.ForceInterfaceSyncWithBackend()
	}
	/* SetFEN(a_fenStr) */







	 /**/
	/*
	NAME : GameBoard.GetMoveFromAI() - Get the move Object from the AI object.

	SYNOPSIS : GetMoveFromAI()

	DESCRIPTION 
				Gets the move object from the AI object.

	RETURNS : An object giving all the details about the best move.
				The details are the move's from and to square in standard string format,
				weather move is a castling move, promotion move or a capture move,
				the 32 bit number encapsulating the entire move

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/16/2020

	*/
	/**/
	GetMoveFromAI = async () => {
		if (this.state.opponent === "neural") {
			return await this.GetMoveFromNeuralAI()
		}
		return this.standard_ai.SearchPosition()
	}
	/* GetMoveFromAI() */




	 /**/
	/*
	NAME : GameBoard.GetMoveFromNeuralAI() - Asks the trained network for a move.

	SYNOPSIS : GetMoveFromNeuralAI()

	DESCRIPTION
				Sends the current position (as FEN) to the AlphaZero inference
				server and converts the returned UCI move into the move object the
				interface expects. Returns null and surfaces an error message if
				the server cannot be reached.

	RETURNS : A move object, or null on failure.

	AUTHOR : Srijan Prasad Joshi

	DATE : 10/04/2026

	*/
	/**/
	GetMoveFromNeuralAI = async () => {
		const fen = this.GameBoard.GiveFen()
		this.setState({ ai_thinking: true, neural_error: "" })
		try {
			const response = await fetch(`${NEURAL_SERVER_URL}/move`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					fen: fen,
					simulations: NEURAL_SIMULATIONS,
					temperature: 0,
					top_k: 5,
				}),
			})
			if (!response.ok) {
				throw new Error(`server responded ${response.status}`)
			}
			const data = await response.json()
			return this.ConvertUciToAIMove(data.move)
		} catch (error) {
			console.error("Neural AI request failed:", error)
			this.setState({
				neural_error:
					"Neural AI unavailable. Is scripts/serve.py running?",
			})
			return null
		}
	}
	/* GetMoveFromNeuralAI() */




	 /**/
	/*
	NAME : GameBoard.ConvertUciToAIMove() - Converts a UCI string to the interface move object.

	SYNOPSIS : ConvertUciToAIMove(a_uci)
				a_uci -> A UCI move string such as "e2e4" or "e7e8q".

	DESCRIPTION
				Builds the move object used by ApplyAIMove from a UCI string,
				using the board's move generator to detect castling and en passant
				and mapping the promotion character to a piece.

	RETURNS : A move object with from, to, isCastling, promotedPiece, enPass.

	AUTHOR : Srijan Prasad Joshi

	DATE : 10/04/2026

	*/
	/**/
	ConvertUciToAIMove = (a_uci) => {
		const from = a_uci.substring(0, 2)
		const to = a_uci.substring(2, 4)
		const promotion = a_uci.length > 4 ? a_uci[4].toLowerCase() : null
		const status = this.GameBoard.GetMoveStatus(from, to)

		let promotedPiece = PIECES.EMPTY
		if (promotion) {
			const white_map = { q: PIECES.wQ, r: PIECES.wR, b: PIECES.wB, n: PIECES.wN }
			const black_map = { q: PIECES.bQ, r: PIECES.bR, b: PIECES.bB, n: PIECES.bN }
			const map = (this.GameBoard.m_side === COLOURS.WHITE) ? white_map : black_map
			promotedPiece = map[promotion] !== undefined ? map[promotion] : PIECES.EMPTY
		}

		return {
			from: from,
			to: to,
			isCastling: status.castle_move,
			promotedPiece: promotedPiece,
			enPass: status.enPass_move,
		}
	}
	/* ConvertUciToAIMove(a_uci) */




	 /**/
	/*
	NAME : GameBoard.GetDisplayValueForPiece() - Maps a piece enum to the interface's display value.

	SYNOPSIS : GetDisplayValueForPiece(a_piece)
				a_piece -> A piece from the PIECES dictionary.

	DESCRIPTION
				Maps a piece enum to the numeric value used by the visual board
				interface.

	RETURNS : The display value for the piece.

	AUTHOR : Srijan Prasad Joshi

	DATE : 10/04/2026

	*/
	/**/
	GetDisplayValueForPiece = (a_piece) => {
		if (a_piece === PIECES.wQ) return 9
		if (a_piece === PIECES.wR) return 5
		if (a_piece === PIECES.wB) return 3.5
		if (a_piece === PIECES.wN) return 3
		if (a_piece === PIECES.bQ) return 19
		if (a_piece === PIECES.bR) return 15
		if (a_piece === PIECES.bB) return 13.5
		if (a_piece === PIECES.bN) return 13
		return 0
	}
	/* GetDisplayValueForPiece(a_piece) */







	 /**/
	/*
	NAME : GameBoard.PlayMoveFromAI() - Gets the move from the AI and plays it on the interface.

	SYNOPSIS : PlayMoveFromAI()

	DESCRIPTION 
				Gets the move from the AI and plays it on the interface.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/16/2020

	*/
	/**/
	PlayMoveFromAI = async () => {
		const move = await this.GetMoveFromAI()
		if (move === null || move === undefined) {
			// The neural request failed; release the user and show the error.
			this.setState({ ai_thinking: false })
			this._board.current._board.current.UnBlockUserInput()
			return
		}

		this.ApplyAIMove(move)

		const newState = {}
		newState.who_moves = !this.state.who_moves
		newState.ai_thinking = false
		this.setState(newState, () => {
			this._board.current._board.current.UnBlockUserInput()
			this.CheckForGameEndAndShow()
		})
	}
	/* PlayMoveFromAI() */




	 /**/
	/*
	NAME : GameBoard.ApplyAIMove() - Applies an AI move to both the interface and game logic.

	SYNOPSIS : ApplyAIMove(a_move)
				a_move -> A move object with from, to, isCastling, promotedPiece,
							enPass and (for the classic AI) the 32-bit move.

	DESCRIPTION
				Updates the visual interface for castling, promotion and en passant
				moves, then makes the move in the game logic. Works for both the
				classic alpha-beta AI (which supplies the bit move) and the neural
				AI (which supplies UCI squares only).

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 10/04/2026

	*/
	/**/
	ApplyAIMove = (a_move) => {
		const side_to_move = this.GameBoard.m_side
		if(a_move.isCastling){
			if(a_move.to === 'g1') {
				this._board.current._board.current.PerformWhiteKingSideCastle(this._board.current._board.current.state.curPosition)
			}else if (a_move.to === 'c1'){
				this._board.current._board.current.PerformWhiteQueenSideCastle(this._board.current._board.current.state.curPosition)
			}else if (a_move.to === 'g8') {
				this._board.current._board.current.PerformBlackKingSideCastle(this._board.current._board.current.state.curPosition)
			}else if (a_move.to === 'c8'){
				this._board.current._board.current.PerformBlackQueenSideCastle(this._board.current._board.current.state.curPosition)
			}
		} else if (a_move.promotedPiece !== PIECES.EMPTY) {
			const piece_val = this.GetDisplayValueForPiece(a_move.promotedPiece)
			const location_val_1 = {location: a_move.from, value: 0}
			const location_val_2 = {location: a_move.to, value: piece_val}
			this._board.current._board.current.PutMultiplePiecesOnBoard([location_val_1, location_val_2])
		}else if(a_move.enPass) {
			const piece_val = (side_to_move === COLOURS.WHITE) ? 1 : 11
			const location_val_1 = {location: a_move.from, value: 0}
			const location_val_2 = {location: a_move.to, value: piece_val}
			const location_val_3 = {location: a_move.to[0] + a_move.from[1], value: 0}
			this._board.current._board.current.PutMultiplePiecesOnBoard([location_val_1, location_val_2, location_val_3])
		} else {
			this._board.current._board.current.MovePieceInsideInterface(a_move.from, a_move.to)
		}

		if (a_move.move !== undefined && a_move.move !== null) {
			this.GameBoard.MakeMove(a_move.move)
		} else {
			this.GameBoard.MovePieceUsingStandardLocations(a_move.from, a_move.to, a_move.promotedPiece)
		}
		this.GameBoard.PrintBoard()
	}
	/* ApplyAIMove(a_move) */




	 /**/
	/*
	NAME : GameBoard.CheckForGameEndAndShow() - Shows the end-game message if the game is over.

	SYNOPSIS : CheckForGameEndAndShow()

	DESCRIPTION
				Checks for draws and wins and, if the game is over, shows the
				corresponding end-game menu.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 10/04/2026

	*/
	/**/
	CheckForGameEndAndShow = () => {
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
	}
	/* CheckForGameEndAndShow() */

	//this function blocks user input while AI is processing
	// this also plays the ai move while checking if game ended






	 /**/
	/*
	NAME : GameBoard.PerformAIMoveBlocking() - Plays move from the AI on the board and checks if the game has ended.

	SYNOPSIS : PerformAIMoveBlocking()

	DESCRIPTION 
				Plays move from the AI on the board and checks if the game has ended.
				Blocks the user input while the AI is thinking.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/19/2020

	*/
	/**/
	PerformAIMoveBlocking = () => {
		//Checks if Game Ends
		if(this.GameBoard.CheckIfDrawnPosition() ||
			this.GameBoard.GetWhichSideWon() === COLOURS.WHITE ||
			this.GameBoard.GetWhichSideWon() === COLOURS.BLACK) {
			this.CheckForGameEndAndShow()
			return
		}

		//creating timeout to make it asynchronous and not block the main program.
		//PlayMoveFromAI awaits the (possibly remote) move and then unblocks input.
		setTimeout(() => {
			this._board.current._board.current.BlockUserInput()
			this.PlayMoveFromAI()
		}, 10)
	}
	/* PerformAIMoveBlocking() */







	 /**/
	/*
	NAME : GameBoard.CallbackToIndicateMoveIsPlayed() - The interface uses this callback to indicate to this
														component that the user completed a move in the interface.

	SYNOPSIS : CallbackToIndicateMoveIsPlayed(a_prev_location, a_new_location)
				a_prev_location -> The from location in standard string format.
				a_new_location -> The to location in standard string format.

	DESCRIPTION 
				The interface uses this callback to indicate to this
				component that the user completed a move in the interface.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/19/2020

	*/
	/**/
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
				newState.noOfFullMovesPlayed = this.state.noOfFullMovesPlayed + 1
				this.setState(newState)
				return
			}
			if(moveStatus.enPass_move) {
				const file = a_new_location[0]
				const rank = a_prev_location[1]

				const location_val_1 = {location: file + rank, value: 0}
				this._board.current._board.current.PutMultiplePiecesOnBoard([location_val_1])

			}
			this.GameBoard.MovePieceUsingStandardLocations(a_prev_location, a_new_location)
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

		newState.noOfFullMovesPlayed = this.state.noOfFullMovesPlayed + 1
		this.setState(newState, () => {
			this.PerformAIMoveBlocking()
		})
	}
	/* CallbackToIndicateMoveIsPlayed(a_prev_location, a_new_location) */







	 /**/
	/*
	NAME : GameBoard.GetMoveStatus() - Gets the move status from the AI.

	SYNOPSIS : GetMoveStatus(a_prev_location, a_new_location)
				a_prev_location -> The from location in standard string format.
				a_new_location -> The to location in standard string format.

	DESCRIPTION 
				Gets the move status from the AI.

	RETURNS : an object detailing the status of the move.
				It gives the following information:
					- is the move valid,
					- is the move a castle move
					- is the move a promotion move.

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/19/2020

	*/
	/**/
	GetMoveStatus = (a_prev_location, a_new_location) => {
		return this.GameBoard.GetMoveStatus(a_prev_location, a_new_location)
	}
	/* GetMoveStatus(a_prev_location, a_new_location) */







	 /**/
	/*
	NAME : GameBoard.CallbackInsertPromotionPiece() - Callback to indicate that user successfully chose a promotion piece.

	SYNOPSIS : CallbackInsertPromotionPiece(a_piece_val, a_file_number)
				a_piece_val -> The piece value given by pieces_val dictionary.
				a_file_number -> The file in which to insert the promotion piece.
	DESCRIPTION 
				Callback to indicate that user successfully chose a promotion piece.
				Makes a promotion move in the game.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
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

		this.GameBoard.MovePieceUsingStandardLocations(this.state.prev_location, this.state.new_location, promPiece)

		const newState = {}
		newState.who_moves = !this.state.who_moves
		this.setState(newState, () => {
			this.PerformAIMoveBlocking()
		})

	}
	/* CallbackInsertPromotionPiece(a_piece_val, a_file_number) */







	 /**/
	/*
	NAME : GameBoard.CallbackCancelPromotionLayout() - Erases the promotion menu from the screen.

	SYNOPSIS : CallbackCancelPromotionLayout()

	DESCRIPTION 
				Erases the promotion menu from the screen.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
	CallbackCancelPromotionLayout = () => {
		const pawn_val = (this.state.user_color === 0) ? 1 : 11
		const location_val_1 = {location: this.state.prev_location, value: pawn_val}
		const location_val_2 = {location: this.state.new_location, value: 0}

		this._board.current._board.current.PutMultiplePiecesOnBoard([location_val_1, location_val_2])
		this._board.current.HidePromotionSelectionMenu()
	}
	/* CallbackCancelPromotionLayout() */







	 /**/
	/*
	NAME : GameBoard.CallbackButtonclickTakeback() - Handler for the TakeBack button.

	SYNOPSIS : CallbackButtonclickTakeback()

	DESCRIPTION 
				Takes back a move.
				If in starting position, does nothing.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/19/2020

	*/
	/**/
	CallbackButtonclickTakeback = () => {
		if(this.state.noOfFullMovesPlayed === 0) {
			return
		}
		const newState = {}
		newState.noOfFullMovesPlayed = this.state.noOfFullMovesPlayed - 1
		this.setState(newState)
		this.GameBoard.TakeBack_Move()
		this.GameBoard.TakeBack_Move()
		this.ForceInterfaceSyncWithBackend()
	}
	/* CallbackButtonclickTakeback() */







	 /**/
	/*
	NAME : GameBoard.CallbackButtonclickOfferDraw() - Handler for the Offer Draw button.

	SYNOPSIS : CallbackButtonclickOfferDraw()

	DESCRIPTION 
				Handler for the Offer Draw button.
				Offers a draw to the AI. If AI thinks that it is slightly worse, it will accept.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/19/2020

	*/
	/**/
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
	/* CallbackButtonclickOfferDraw() */







	 /**/
	/*
	NAME : GameBoard.CallbackButtonclickResign() - Handler for the resign button.

	SYNOPSIS : CallbackButtonclickResign()

	DESCRIPTION 
				Handler for the resign button..
				The user admits defeat after this.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/19/2020

	*/
	/**/
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
	/* CallbackButtonclickResign() */







	 /**/
	/*
	NAME : GameBoard.CallbackButtonclickRestartGame() - CallBack for the restart button

	SYNOPSIS : CallbackButtonclickRestartGame()

	DESCRIPTION 
				Restarts the game with the currently chosen side.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/13/2020

	*/
	/**/
	CallbackButtonclickRestartGame = () => {
		const newState = {}
		newState.user_color = this._board.current.state.radio_button_user_color
		newState.who_moves = 0
		newState.noOfFullMovesPlayed = 0
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
	/* CallbackButtonclickRestartGame() */
	






	 /**/
	/*
	NAME : GameBoard.CallbackSetUserColor() - Sets the user color.

	SYNOPSIS : CallbackSetUserColor(a_user_color)
				a_user_color -> The user color to be set. 0 if white and 1 if black.

	DESCRIPTION 
				Sets the user color state variable.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/13/2020

	*/
	/**/
	CallbackSetUserColor = (a_user_color) => {
		const newState = {}
		newState.user_color = a_user_color
		this.setState(newState)
	}
	/* CallbackSetUserColor(a_user_color) */

	// Makes the display chess board position match up to the position in the GameBoard logic






	 /**/
	/*
	NAME : GameBoard.ForceInterfaceSyncWithBackend() - Forces the interface to be the same as chess logic.

	SYNOPSIS : ForceInterfaceSyncWithBackend()

	DESCRIPTION 
				Forces the interface to be the same as chess logic.
				Removes all the pieces on the board and adds every piece in the game logic.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 07/13/2020

	*/
	/**/
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
	/* ForceInterfaceSyncWithBackend() */







	 /**/
	/*
	NAME : GameBoard.componentDidMount() - A standard ReactJS componentDidMount function.

	SYNOPSIS : componentDidMount()

	DESCRIPTION 
				Makes the AI play the move if the user color is black because white starts first.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/18/2020

	*/
	/**/
	componentDidMount() {
		if(this.state.user_color === 1) {
			this.PlayMoveFromAI()
		} else {

		}
	}
	/* componentDidMount() */
}

export default PlayWithAIComponent
