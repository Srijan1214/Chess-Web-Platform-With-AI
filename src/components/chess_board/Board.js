import React from "react"
import _ from "lodash"
import {asd} from "./basic_methods"
import {convert_fileRank_to_rowCol, convert_rowCol_to_fileRank} from "../../utility_functions/Utility"

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
		// this.mouseClickHandler = this.mouseClickHandler.bind(this)
		// this.mouseDragHandler = this.mouseDragHandler.bind(this)
		// this.mouseUpHandler = this.mouseUpHandler.bind(this)
		// this.MouseRightClickHandler = this.MouseRightClickHandler.bind(this)
		// this.KeyboardPressHandler = this.KeyboardPressHandler.bind(this)
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
		const styling = { height: this.state.canvas_height, width: this.state.canvas_width, margins: 0, padding: 0 }
		return (
			<div>
				<canvas id="chess_board" style={styling} ref={this.chess_board_canvas} onMouseDown={this.mouseClickHandler}
					onMouseMove={this.mouseDragHandler} onMouseUp={this.mouseUpHandler}
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
			// img.src = "https://3ad579acbe8e.ngrok.io/resources/image/piece/" + piece;
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
				this.put_piece_at(c + 1, r + 1, this.state.img_dict[this.piece_to_pice_val_dict[this.state.curPosition[7 - r][c]]], this.state.curPosition[7 - r][c])
			}
		}
	}

	mouseClickHandler = (event)=> {
		if (this) {
			if (event.buttons === 1) {
				let rect = event.currentTarget.getBoundingClientRect();
				let x = event.clientX - rect.left;
				let y = event.clientY - rect.top;

				let canvas_width = event.currentTarget.width
				let canvas_height = event.currentTarget.height

				x = x * canvas_width / this.state.canvas_width
				y = y * canvas_height / this.state.canvas_height

				let r = parseInt((x / (canvas_width - 1)) * 8)
				let c = parseInt((y / (canvas_height - 1)) * 8)

				const newState = {}
				newState.dragging = true
				newState.first_load = this.state.first_load + 1
				if (this.state.curPosition[c][r] !== 0) {
					newState.current_image = this.state.img_dict[this.piece_to_pice_val_dict[this.state.curPosition[c][r]]]
					newState.old_image_value = this.state.curPosition[c][r]
					// clone deep is important as we do not wish to manipulate the previous reference. 
					// i.e we will alter the positions array as this.state.curPosition exists inside positions
					newState.curPosition = _.cloneDeep(this.state.curPosition)
					newState.curPosition[c][r] = 0
					newState.old_image_position = [c,r]
				}
				newState.current_image_position = [x, y]
				this.setState(newState)
			} else if (event.buttons === 3) {
				const newState = {}
				this.cancelMove(newState)
				this.setState(newState)
			}
		}
	}

	mouseDragHandler = (event)=> {
		if (this && event.buttons === 1) {
			if (this.state.dragging) {
				let rect = event.currentTarget.getBoundingClientRect();
				let x = event.clientX - rect.left;
				let y = event.clientY - rect.top;

				let canvas_width = event.currentTarget.width
				let canvas_height = event.currentTarget.height

				x = x * canvas_width / this.state.canvas_width
				y = y * canvas_height / this.state.canvas_height

				const newState = {}
				newState.current_image_position = [x,y]
				this.setState(newState)
			}
		}
	}

	mouseUpHandler = (event)=> {
		if (this) {
			if (event.buttons === 0) {
				let rect = event.currentTarget.getBoundingClientRect();
				let x = event.clientX - rect.left;
				let y = event.clientY - rect.top;

				let canvas_width = event.currentTarget.width
				let canvas_height = event.currentTarget.height

				x = x * canvas_width / this.state.canvas_width
				y = y * canvas_height / this.state.canvas_height

				let r = parseInt((x / (canvas_width - 1)) * 8)
				let c = parseInt((y / (canvas_height - 1)) * 8)

				const newState = {}
				let shouldCancelMove = (((this.state.curPosition[c][r] < 10 && this.state.curPosition[c][r] !== 0)
					&& this.state.old_image_value < 10) ||
					(this.state.curPosition[c][r] > 10 && this.state.old_image_value > 10)) &&
					(!(this.state.old_image_position[0] === c && (this.state.old_image_position[1] === r)))
					&& this.state.dragging
				const new_location = convert_rowCol_to_fileRank(c, r)
				const prev_location = convert_rowCol_to_fileRank(this.state.old_image_position[0], this.state.old_image_position[1])
				shouldCancelMove = shouldCancelMove || !this.props.check_if_valid_move(prev_location, new_location)
				if (shouldCancelMove) {
					this.cancelMove(newState) 
					newState.current_image = null
					newState.old_image_value = 0
					newState.dragging = false
					this.setState(newState)
					return
				}
				if (this.state.old_image_value !== 0) {
					newState.curPosition = _.cloneDeep(this.state.curPosition)
					newState.curPosition[c][r] = this.state.old_image_value
					if (!(c === this.state.old_image_position[0] && r === this.state.old_image_position[1])) {
						if (this.state.positions.length === this.state.position_index + 1) {// a new move
							newState.positions = [...this.state.positions].concat([newState.curPosition])
						} else {// delete old branch and overwrtie with this branch
							newState.positions = [...(this.state.positions.slice(0,this.state.position_index + 1))].concat([newState.curPosition])
						}
						newState.position_index = this.state.position_index + 1
						if(!shouldCancelMove)
						this.props.givePlayedMove(prev_location, new_location)
					}
				}
				newState.current_image = null
				newState.old_image_value = 0
				newState.dragging = false
				this.setState(newState)
			}
		}
	}

	MouseRightClickHandler = (event)=> {
		if (this) {
			event.preventDefault()
		}
	}

	KeyboardPressHandler = (event)=> {
		if (this) {
			if (event.key === "ArrowRight") {
				if (this.state.position_index < this.state.positions.length - 1) {
					const newState = {}
					newState.position_index = this.state.position_index + 1;
					newState.curPosition = this.state.positions[newState.position_index]
					this.setState(newState)
				}
			} else if (event.key === "ArrowLeft") {
				if (this.state.position_index > 0) {
					const newState = {}
					newState.position_index = this.state.position_index - 1
					newState.curPosition = this.state.positions[newState.position_index]
					this.setState(newState)
				}
			} else if (event.key === "ArrowUp") {
				if (this.state.positions.length > 0) {
					const newState = {}
					newState.position_index = this.state.positions.length - 1
					newState.curPosition = this.state.positions[newState.position_index]
					this.setState(newState)
				}
			} else if (event.key === "ArrowDown") {
				if (this.state.positions.length > 0) {
					const newState = {}
					newState.position_index = 0
					newState.curPosition = this.state.positions[newState.position_index]
					this.setState(newState)
				}
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
		newState.curPosition = temp
		setTimeout(()=> {
			this.setState(newState)
		},1200)
	}

	getMoveNumber(){
		return this.state.positions.length
	}

}


export default Board