import React from "react"
import _ from "lodash"
import { get_flipped_row_column, get_flipped_square } from "../../utility_functions/Utility.js"
import * as Board_input_handlers from "./Board_input_handlers"
import * as Board_castle_performers from "./perform_castles"

class Board extends React.Component {
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
		this.mouseClickHandler = Board_input_handlers.Outside_mouseClickHandler.bind(this)
		this.mouseDragHandler = Board_input_handlers.Outside_mouseDragHandler.bind(this)
		this.mouseUpHandler = Board_input_handlers.Outside_mouseUpHandler.bind(this)
		this.MouseRightClickHandler = Board_input_handlers.Outside_MouseRightClickHandler.bind(this)
		this.KeyboardPressHandler = Board_input_handlers.Outside_KeyboardPressHandler.bind(this)
		this.mouseOutHandler = Board_input_handlers.Outside_MouseOutHandler.bind(this)

		// castling function
		this.perform_white_king_side_castle = Board_castle_performers.perform_white_king_side_castle.bind(this)
		this.perform_white_queen_side_castle = Board_castle_performers.perform_white_queen_side_castle.bind(this)
		this.perform_black_king_side_castle = Board_castle_performers.perform_black_king_side_castle.bind(this)
		this.perform_black_queen_side_castle = Board_castle_performers.perform_black_queen_side_castle.bind(this)
	}

	componentDidMount() {
		this.load_images()
		const canvas = this.chess_board_canvas.current
		const dpi = window.devicePixelRatio;
		function fix_dpi() {
			const style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
			const style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
			canvas.setAttribute('height', style_height * dpi);
			canvas.setAttribute('width', style_width * dpi);
		}
		fix_dpi()
		this.draw_board(canvas)
	}

	componentDidUpdate() {
		const canvas = this.chess_board_canvas.current
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		this.draw_board(canvas)
		if (this.state.are_images_loaded) {
			this.put_starting_pieces_on_board(canvas)
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

	render() {
		const styling = { height: this.state.canvas_height, width: this.state.canvas_width, margins: 0, padding: 0, backgroundColor: "darkgrey" }
		return (
			<div>
				<canvas id="chess_board" style={styling} ref={this.chess_board_canvas} onMouseDown={this.mouseClickHandler}
					onMouseMove={this.mouseDragHandler} onMouseUp={this.mouseUpHandler}
					onMouseOut={this.mouseOutHandler}
					onContextMenu={this.MouseRightClickHandler} onKeyDown={this.KeyboardPressHandler}
					tabIndex="0"></canvas>
			</div>
		)
	}

	draw_board(canvas) {
		const ctx = canvas.getContext("2d")
		const dx = canvas.width / 8
		const dy = canvas.height / 8
		ctx.fillStyle = "grey"
		for (let i = 1; i < 9; i += 2) {
			for (let j = 0; j < 9; j++) {
				let x1 = canvas.width - j * dx
				let y1 = canvas.height - i * dy
				if (j % 2 === 1) { y1 -= dy }
				ctx.fillRect(x1, y1, dx, dy)
			}
		}
	}

	load_images() {
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

	put_piece_at(x, y, img, value) {
		const canvas = this.chess_board_canvas.current
		if (value !== 0) {
			const dx = canvas.width / 8
			const dy = canvas.height / 8

			const ctx = canvas.getContext("2d")

			ctx.drawImage(img, (x - 1) * dx, canvas.height - (y) * dy, dx, dy);
		}
	}

	put_starting_pieces_on_board(canvas) {
		for (let r = 0; r < this.state.curPosition.length; r++) {
			for (let c = 0; c < this.state.curPosition[r].length; c++) {
				let [a, b] = [r, c]
				if(this.user_color === 1) {
					let temp = get_flipped_row_column(r, c)
					a = temp.r
					b = temp.c
				}
				this.put_piece_at(b + 1, a + 1, this.state.img_dict[this.piece_to_pice_val_dict[this.state.curPosition[7 - r][c]]], this.state.curPosition[7 - r][c])
			}
		}
	}

	cancelMove(newState) {
		if (this.state.old_image_value !== 0) {
			newState.curPosition = _.cloneDeep(this.state.curPosition)
			newState.curPosition[this.state.old_image_position[0]][this.state.old_image_position[1]] = this.state.old_image_value
			newState.dragging = false
			newState.current_image = null
			newState.old_image_value = 0
		}
	}

	put_piece_on_board(new_location, value) {
		let row = 8 - parseInt(new_location[1])
		let column = (new_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

		let newState = {}
		// clone deep is important as we do not wish to manipulate the previous reference. 
		// i.e we might alter the positions array as this.state.curPosition exists inside positions
		const temp = _.cloneDeep(this.state.curPosition)
		temp[row][column] = value
		newState.positions = this.state.positions.concat([temp])
		newState.curPosition = temp
		this.setState(newState)
	}

	makeMove = (prev_location, new_location) => {
		let prev_row = 8 - parseInt(prev_location[1])
		let prev_column = (prev_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

		let new_row = 8 - parseInt(new_location[1])
		let new_column = (new_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

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

	block_user_input = () => {
		const newState = {}
		newState.should_block_user_input = true
		this.setState(newState)
	}

	unblock_user_input = () => {
		const newState = {}
		newState.should_block_user_input = false
		this.setState(newState)
	}
}


export default Board