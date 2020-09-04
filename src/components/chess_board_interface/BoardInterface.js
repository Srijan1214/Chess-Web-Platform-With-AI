/**/
/* 
	 * FILE DESCRIPTION:
	 * This file contains the class for the Board Interface.
	 * The board interface is only the chess board that supports dragging and dropping pieces.
	 * While dragging and dropping, the piece at the to square is erased from the one at the front square and
	 * the piece at the from square is cleared.
*/
/**/
import React from "react"
import _ from "lodash"
import { Get_Flipped_Row_Column, Convert_FileRank_To_RowCol } from "../../utility_functions/Utility.js"
import * as Board_input_handlers from "./Board_input_handlers"
import * as Board_castle_performers from "./perform_castles"

// The BoardInterface class definition
class BoardInterface extends React.Component {
	constructor(props) {
		super(props)
		const startPosition =[
		[15, 13, 13.5, 19, 14, 13.5, 13, 15],
		[11, 11, 11, 11, 11, 11, 11, 11],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
		this.user_color = props.user_color //which side view's the board
		this.state = {
			canvas_width: props.width,
			canvas_height: props.height,
			img_dict: {},
			are_images_loaded: false,
			first_load: 0,
			curPosition:startPosition,
			positions: [startPosition],
			position_index: 0,
			dragging: false,
			should_block_user_input: false,
			image_list: [],
			current_image: null,
			current_image_position: [0, 0],
			old_image_position: [0, 0],
			old_image_value: 0
		}
		this.piece_to_pice_val_dict = {
			3.5: "white_bish", 13.5: "black_bish", 3: "white_knight", 13: "black_knight",
			5: "white_rook", 15: "black_rook", 9: "white_queen", 19: "black_queen", 4: "white_king",
			14: "black_king", 1: "white_pawn", 11: "black_pawn"
		}
		this.chess_board_canvas = React.createRef();
		this.MouseClickHandler = Board_input_handlers.Outside_MouseClickHandler.bind(this)
		this.MouseDragHandler = Board_input_handlers.Outside_MouseDragHandler.bind(this)
		this.MouseUpHandler = Board_input_handlers.Outside_MouseUpHandler.bind(this)
		this.MouseRightClickHandler = Board_input_handlers.Outside_MouseRightClickHandler.bind(this)
		this.MouseOutsideDragHandler = Board_input_handlers.Outside_MouseOutHandler.bind(this)

		// castling function
		this.PerformWhiteKingSideCastle = Board_castle_performers.PerformWhiteKingSideCastle.bind(this)
		this.PerformWhiteQueenSideCastle = Board_castle_performers.PerformWhiteQueenSideCastle.bind(this)
		this.PerformBlackKingSideCastle = Board_castle_performers.PerformBlackKingSideCastle.bind(this)
		this.PerformBlackQueenSideCastle = Board_castle_performers.PerformBlackQueenSideCastle.bind(this)
	}








	 /**/
	/*
	NAME : GameBoard.componentDidMount() - Standard ReactJS componentDidMount function.

	SYNOPSIS : componentDidMount()

	DESCRIPTION 
				Standard ReactJS componentDidMount function.
				Loads the piece images from the server and renders the game board.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 06/03/2020

	*/
	/**/
	componentDidMount() {
		this.LoadImagesFromServer()
		const canvas = this.chess_board_canvas.current
		const dpi = window.devicePixelRatio;
		function fix_dpi() {
			const style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
			const style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
			canvas.setAttribute('height', style_height * dpi);
			canvas.setAttribute('width', style_width * dpi);
		}
		fix_dpi()
		this.DrawBoard(canvas)
	}
	/* componentDidMount() */








	 /**/
	/*
	NAME : GameBoard.componentDidUpdate() - Standard ReactJS componentDidUpdate function.

	SYNOPSIS : componentDidUpdate()

	DESCRIPTION 
				Redraws the board with images at the proper location.
				Is called every time the state changes.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 06/03/2020

	*/
	/**/
	componentDidUpdate() {
		const canvas = this.chess_board_canvas.current
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		this.DrawBoard(canvas)
		if (this.state.are_images_loaded) {
			this.FillCanvasWithPieceImages(canvas)
			if (this.state.current_image !== null) {
				const ctx = canvas.getContext("2d")
				const dx = canvas.width / 8
				const dy = canvas.height / 8
				let x = this.state.current_image_position[0]
				let y = this.state.current_image_position[1]
				ctx.drawImage(this.state.current_image, parseInt(x - dx / 2), parseInt(y - dy / 2), dx, dy)
			}
		}
	}
	/* componentDidUpdate() */








	 /**/
	/*
	NAME : GameBoard.render() - Standard ReactJS render function.

	SYNOPSIS : render()

	DESCRIPTION 
				Puts a JSX canvas with the dimensions passed through the props and adds appropriate event
				listeners to it.

	RETURNS : A JSX div containing the required information.

	AUTHOR : Srijan Prasad Joshi

	DATE : 06/03/2020

	*/
	/**/
	render() {
		const styling = { height: this.state.canvas_height, width: this.state.canvas_width, margins: 0, padding: 0, backgroundColor: "darkgrey" }
		return (
			<div>
				<canvas id="chess_board" style={styling} ref={this.chess_board_canvas} onMouseDown={this.MouseClickHandler}
					onMouseMove={this.MouseDragHandler} onMouseUp={this.MouseUpHandler}
					onMouseOut={this.MouseOutsideDragHandler}
					onContextMenu={this.MouseRightClickHandler}
					tabIndex="0"></canvas>
			</div>
		)
	}
	/* render() */








	 /**/
	/*
	NAME : GameBoard.DrawBoard() - Draws the square on the board.

	SYNOPSIS : DrawBoard(a_canvas)
				a_canvas -> the canvas object on which to draw.

	DESCRIPTION 
				Draws the square on the board.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 06/04/2020

	*/
	/**/
	DrawBoard(a_canvas) {
		const ctx = a_canvas.getContext("2d")
		const dx = a_canvas.width / 8
		const dy = a_canvas.height / 8
		ctx.fillStyle = "grey"
		for (let index = 1; index < 9; index += 2) {
			for (let j = 0; j < 9; j++) {
				let x1 = a_canvas.width - j * dx
				let y1 = a_canvas.height - index * dy
				if (j % 2 === 1) { y1 -= dy }
				ctx.fillRect(x1, y1, dx, dy)
			}
		}
	}
	/* DrawBoard(a_canvas) */








	 /**/
	/*
	NAME : GameBoard.LoadImagesFromServer() - Loads the images from the server and puts it inside the state.

	SYNOPSIS : LoadImagesFromServer()

	DESCRIPTION 
				Loads the images from the server and puts it inside the this.state object.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 06/03/2020

	*/
	/**/
	LoadImagesFromServer() {
		let images = [
			"white_bish", "black_bish", "white_knight", "black_knight",
			"white_rook", "black_rook", "white_queen", "black_queen", "white_king",
			"black_king", "white_pawn", "black_pawn"
		]
		let img_dict = {}

		const loadImage = (piece) => new Promise(resolve => {
			let img = new Image();
			// img.src = "https://short-newt-45.serverless.social/resources/image/piece/" + piece;
			img.src = "http://localhost:3001/resources/image/piece/" + piece;
			img.draggable = "true"
			img.name = piece
			img.onload = function () {
				resolve(img);
			};
		});

		const whenAllImagesAreLoaded = (sources) => Promise.all(
			sources.map(ele => loadImage(ele))
		)

		whenAllImagesAreLoaded(images).then((images => {
			images.forEach(image => {
				img_dict[image.name] = image
			});

			this.setState({
				img_dict: img_dict,
				are_images_loaded : true,
				first_load: this.state.first_load + 1
			})
		}))
	}
	/* LoadImagesFromServer() */








	 /**/
	/*
	NAME : GameBoard.PutPieceImageAt() - Puts a piece image inside the coordinates in the canvas.

	SYNOPSIS : PutPieceImageAt(a_x, a_y, a_img, a_value)
				a_x -> The x-coordinate inside the canvas.
				a_y -> The y-coordinate inside the canvas.
				a_img -> The image object to draw.
				a_value -> The value of the piece given by this.piece_val dictionary.

	DESCRIPTION 
				Puts a piece image at the coordinates in the canvas.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/06/2020

	*/
	/**/
	PutPieceImageAt(a_x, a_y, a_img, a_value) {
		const canvas = this.chess_board_canvas.current
		if (a_value !== 0) {
			const dx = canvas.width / 8
			const dy = canvas.height / 8

			const ctx = canvas.getContext("2d")

			ctx.drawImage(a_img, (a_x - 1) * dx, canvas.height - (a_y) * dy, dx, dy);
		}
	}
	/* PutPieceImageAt(a_x, a_y, a_img, a_value) */








	 /**/
	/*
	NAME : GameBoard.FillCanvasWithPieceImages() - Draws appropriate images aligning with the this.state.curPosition array.

	SYNOPSIS : FillCanvasWithPieceImages()

	DESCRIPTION 
				Draws appropriate images aligning with the this.state.curPosition array.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 06/03/2020

	*/
	/**/
	FillCanvasWithPieceImages() {
		for (let row = 0; row < this.state.curPosition.length; row++) {
			for (let column = 0; column < this.state.curPosition[row].length; column++) {
				let [a, b] = [row, column]
				if(this.props.GetUserColor() === 1) {
					let temp = Get_Flipped_Row_Column(row, column)
					a = temp.row
					b = temp.column
				}
				this.PutPieceImageAt(b + 1, a + 1, this.state.img_dict[this.piece_to_pice_val_dict[this.state.curPosition[7 - row][column]]], this.state.curPosition[7 - row][column])
			}
		}
	}
	/* FillCanvasWithPieceImages() */








	 /**/
	/*
	NAME : GameBoard.StopMouseInputAndCancelMove() - Revert the position before the drag-drop started.

	SYNOPSIS : StopMouseInputAndCancelMove(a_newState)
				a_newState -> The newState object to pass into this.setState().

	DESCRIPTION 
				Revert the position before the drag-drop started.
				This is useful if the user makes an invalid move.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 06/12/2020

	*/
	/**/
	StopMouseInputAndCancelMove(a_newState) {
		if (this.state.old_image_value !== 0) {
			a_newState.curPosition = _.cloneDeep(this.state.curPosition)
			a_newState.curPosition[this.state.old_image_position[0]][this.state.old_image_position[1]] = this.state.old_image_value
			a_newState.dragging = false
			a_newState.current_image = null
			a_newState.old_image_value = 0
		}
	}
	/* StopMouseInputAndCancelMove(a_newState) */








	 /**/
	/*
	NAME : GameBoard.PutPieceOnBoard() - Puts a piece on a position inside the board.

	SYNOPSIS : PutPieceOnBoard(a_new_location, a_value)
				a_new_location -> The standard string location where the piece is put.
				a_value -> The value of the piece given by this.piece_val dictionary.

	DESCRIPTION 
				Puts a piece on a position inside the board.
				Should not be called many times at once as the ReactJs setState method is asynchronous.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 06/05/2020

	*/
	/**/
	PutPieceOnBoard(a_new_location, a_value) {
		let row = 8 - parseInt(a_new_location[1])
		let column = (a_new_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

		let newState = {}
		// clone deep is important as we do not wish to manipulate the previous reference. 
		// i.e we might alter the positions array as this.state.curPosition exists inside positions
		const temp = _.cloneDeep(this.state.curPosition)
		temp[row][column] = a_value
		newState.positions = this.state.positions.concat([temp])
		newState.curPosition = temp
		this.setState(newState)
	}
	/* PutPieceOnBoard(a_new_location, a_value) */








	 /**/
	/*
	NAME : GameBoard.PutMultiplePiecesOnBoard() - Puts multiple pieces at multiple locations.

	SYNOPSIS : PutMultiplePiecesOnBoard(a_location_val_array)
				a_location_val_array -> an array of object containing two properties: 1) location 2) value

	DESCRIPTION 
				Puts multiple pieces at multiple locations.
				This is necessary as calling multiple PutPieceOnBoard is not recommended since the ReactJs
				setState method is asynchronous.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/06/2020

	*/
	/**/
	PutMultiplePiecesOnBoard(a_location_val_array) {
		let newState = {}
		// clone deep is important as we do not wish to manipulate the previous reference. 
		// i.e we might alter the positions array as this.state.curPosition exists inside positions

		const temp = _.cloneDeep(this.state.curPosition)
		for(const ele of a_location_val_array) {
			let row = 8 - parseInt(ele.location[1])
			let column = (ele.location[0]).charCodeAt(0) - ("a").charCodeAt(0)
			temp[row][column] = ele.value
		}

		newState.positions = this.state.positions.concat([temp])
		newState.curPosition = temp
		this.setState(newState)
	}
	/* PutMultiplePiecesOnBoard(a_location_val_array) */








	 /**/
	/*
	NAME : GameBoard.GetPieceValueAt() - Gets the piece type at the location.

	SYNOPSIS : GetPieceValueAt(a_location)
				a_location -> The standard string location to get the piece from.

	DESCRIPTION 
				Gets the piece type at the location.
				The piece type is given by the piece_val dictionary.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/06/2020

	*/
	/**/
	GetPieceValueAt(a_location) {
		const { row, column} = Convert_FileRank_To_RowCol(a_location)
		return this.state.curPosition[row][column]
	}
	/* GetPieceValueAt(a_location) */

	MovePieceInsideInterface = (a_prev_location, a_new_location) => {
		let prev_row = 8 - parseInt(a_prev_location[1])
		let prev_column = (a_prev_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

		let new_row = 8 - parseInt(a_new_location[1])
		let new_column = (a_new_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

		const newState = {}
		// clone deep is important as we do not wish to manipulate the previous reference. 
		// i.e we might alter the positions array as this.state.curPosition exists inside positions
		const temp = _.cloneDeep(this.state.curPosition)
		temp[new_row][new_column] = this.state.curPosition[prev_row][prev_column]
		temp[prev_row][prev_column] = 0
		newState.positions = this.state.positions.concat([temp])
		newState.position_index = this.state.position_index + 1
		newState.curPosition = temp
		this.setState(newState)
	}








	 /**/
	/*
	NAME : GameBoard.BlockUserInput() - Blocks all user input in the interface.

	SYNOPSIS : BlockUserInput()

	DESCRIPTION 
				Blocks all user input in the interface.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/13/2020

	*/
	/**/
	BlockUserInput = () => {
		const newState = {}
		newState.should_block_user_input = true
		this.setState(newState)
	}
	/* BlockUserInput() */








	 /**/
	/*
	NAME : GameBoard.UnBlockUserInput() - Unblocks and allows user input.

	SYNOPSIS : UnBlockUserInput()

	DESCRIPTION 
				Unblocks and allows user input if it was blocked.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/13/2020

	*/
	/**/
	UnBlockUserInput = () => {
		const newState = {}
		newState.should_block_user_input = false
		this.setState(newState)
	}
	/* UnBlockUserInput() */
}


export default BoardInterface
