import React from "react"

class Board extends React.Component {
	constructor() {
		super()
		this.state = {
			canvas_width: 1200,
			canvas_height: 1200,
			img_dict: {},
			are_images_loaded: false,
			first_load: 0,
			curPosition: [[15, 13, 13.5, 19, 14, 13.5, 13, 15],
			[11, 11, 11, 11, 11, 11, 11, 11],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[5, 3, 3.5, 9, 4, 3.5, 3, 5]],
			positions: [[[15, 13, 13.5, 19, 14, 13.5, 13, 15],
			[11, 11, 11, 11, 11, 11, 11, 11],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[5, 3, 3.5, 9, 4, 3.5, 3, 5]]],
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
		this.mouseClickHandler = this.mouseClickHandler.bind(this)
		this.mouseDragHandler = this.mouseDragHandler.bind(this)
		this.mouseUpHandler = this.mouseUpHandler.bind(this)
		this.MouseRightClickHandler = this.MouseRightClickHandler.bind(this)
		this.KeyboardPressHandler = this.KeyboardPressHandler.bind(this)
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
			this.setState(prevState => {
				let newState = prevState
				newState.img_dict = img_dict
				newState.are_images_loaded = true
				newState.first_load += 1
				return newState
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

	mouseClickHandler(event) {
		if (this) {
			if (event.buttons === 1) {
				let rect = event.currentTarget.getBoundingClientRect();
				let x = event.clientX - rect.left;
				let y = event.clientY - rect.top;

				let canvas_width = event.currentTarget.width
				let canvas_height = event.currentTarget.width

				//Duck
				/////Need to change the constant
				x = x * canvas_width / 1200
				y = y * canvas_height / 1200

				let r = parseInt((x / (canvas_width - 1)) * 8)
				let c = parseInt((y / (canvas_height - 1)) * 8)

				this.setState((prevState) => {
					let newState = prevState
					newState.dragging = true
					newState.first_load += 1
					if (this.state.curPosition[c][r] !== 0) {
						newState.current_image = this.state.img_dict[this.piece_to_pice_val_dict[this.state.curPosition[c][r]]]
						newState.old_image_value = newState.curPosition[c][r]
						newState.curPosition[c][r] = 0
						newState.old_image_position[0] = c
						newState.old_image_position[1] = r
					}
					newState.current_image_position[0] = x
					newState.current_image_position[1] = y
					return newState
				})
			} else if (event.buttons === 3) {
				this.cancelMove()
			}
		}
	}

	mouseDragHandler(event) {
		if (this && event.buttons === 1) {
			if (this.state.dragging) {
				let rect = event.currentTarget.getBoundingClientRect();
				let x = event.clientX - rect.left;
				let y = event.clientY - rect.top;

				let canvas_width = event.currentTarget.width
				let canvas_height = event.currentTarget.width

				//Duck
				/////Need to change the constant
				x = x * canvas_width / 1200
				y = y * canvas_height / 1200

				this.setState((prevState) => {
					let newState = prevState
					newState.current_image_position[0] = x
					newState.current_image_position[1] = y
					return newState
				})

			}
		}
	}

	mouseUpHandler(event) {
		if (this) {
			if (event.buttons === 0) {
				let rect = event.currentTarget.getBoundingClientRect();
				let x = event.clientX - rect.left;
				let y = event.clientY - rect.top;

				let canvas_width = event.currentTarget.width
				let canvas_height = event.currentTarget.width

				//Duck
				/////Need to change the constant
				x = x * canvas_width / 1200
				y = y * canvas_height / 1200

				let r = parseInt((x / (canvas_width - 1)) * 8)
				let c = parseInt((y / (canvas_height - 1)) * 8)

				this.setState((prevState) => {
					let newState = prevState
					let shouldCancelMove = (((newState.curPosition[c][r] < 10 && newState.curPosition[c][r] !== 0)
						&& newState.old_image_value < 10) ||
						(newState.curPosition[c][r] > 10 && newState.old_image_value > 10)) &&
						(!(newState.old_image_position[0] === c && (newState.old_image_position[1] === r)))
						&& this.state.dragging

					if (shouldCancelMove) {
						newState.curPosition[newState.old_image_position[0]][newState.old_image_position[1]] = newState.old_image_value
						newState.dragging = false
						newState.current_image = null
						newState.old_image_value = 0
					}
					if (newState.old_image_value !== 0) {
						newState.curPosition[c][r] = newState.old_image_value
						if (!(c === newState.old_image_position[0] && r === newState.old_image_position[1])) {
							let temp = [[15, 13, 13.5, 19, 14, 13.5, 13, 15],
							[11, 11, 11, 11, 11, 11, 11, 11],
							[0, 0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0, 0],
							[0, 0, 0, 0, 0, 0, 0, 0],
							[1, 1, 1, 1, 1, 1, 1, 1],
							[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
							for (let i = 0; i < temp.length; i++) {
								for (let j = 0; j < temp[i].length; j++) {
									temp[i][j] = newState.curPosition[i][j]
								}
							}
							if (newState.positions.length === newState.position_index + 1) {
								newState.positions = newState.positions.concat([temp])
							} else {
								newState.positions = newState.positions.map((ele, index) => {
									if (index === newState.position_index + 1) {
										return temp
									} else {
										let temp2 = [[15, 13, 13.5, 19, 14, 13.5, 13, 15],
										[11, 11, 11, 11, 11, 11, 11, 11],
										[0, 0, 0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0, 0, 0],
										[0, 0, 0, 0, 0, 0, 0, 0],
										[1, 1, 1, 1, 1, 1, 1, 1],
										[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
										for (let i = 0; i < temp.length; i++) {
											for (let j = 0; j < temp[i].length; j++) {
												temp2[i][j] = ele[i][j]
											}
										}
										return temp2
									}
								})
							}
							newState.position_index++
						}
					}
					newState.current_image = null
					newState.old_image_value = 0
					newState.dragging = false
					return newState
				})
			}
		}
	}

	MouseRightClickHandler(event) {
		if (this) {
			event.preventDefault()
		}
	}

	KeyboardPressHandler(event) {
		if (this) {
			if (event.key === "ArrowRight") {
				if (this.state.position_index < this.state.positions.length - 1) {
					this.setState((prevState) => {
						let newState = prevState
						newState.position_index++
						let temp = [[15, 13, 13.5, 19, 14, 13.5, 13, 15],
						[11, 11, 11, 11, 11, 11, 11, 11],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[1, 1, 1, 1, 1, 1, 1, 1],
						[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
						for (let i = 0; i < temp.length; i++) {
							for (let j = 0; j < temp[i].length; j++) {
								temp[i][j] = newState.positions[newState.position_index][i][j]
							}
						}
						newState.curPosition = temp
						return newState
					})
				}
			} else if (event.key === "ArrowLeft") {

				if (this.state.position_index > 0) {
					this.setState((prevState) => {
						let newState = prevState
						newState.position_index--
						let temp = [[15, 13, 13.5, 19, 14, 13.5, 13, 15],
						[11, 11, 11, 11, 11, 11, 11, 11],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[1, 1, 1, 1, 1, 1, 1, 1],
						[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
						for (let i = 0; i < temp.length; i++) {
							for (let j = 0; j < temp[i].length; j++) {
								temp[i][j] = newState.positions[newState.position_index][i][j]
							}
						}
						newState.curPosition = temp
						return newState
					})
				}
			} else if (event.key === "ArrowUp") {
				if (this.state.positions.length > 0) {
					this.setState((prevState) => {
						let newState = prevState
						newState.position_index = newState.positions.length - 1
						let temp = [[15, 13, 13.5, 19, 14, 13.5, 13, 15],
						[11, 11, 11, 11, 11, 11, 11, 11],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[1, 1, 1, 1, 1, 1, 1, 1],
						[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
						for (let i = 0; i < temp.length; i++) {
							for (let j = 0; j < temp[i].length; j++) {
								temp[i][j] = newState.positions[newState.position_index][i][j]
							}
						}
						newState.curPosition = temp
						return newState
					})
				}
			} else if (event.key === "ArrowDown") {
				if (this.state.positions.length > 0) {
					this.setState((prevState) => {
						let newState = prevState
						newState.position_index = 0
						let temp = [[15, 13, 13.5, 19, 14, 13.5, 13, 15],
						[11, 11, 11, 11, 11, 11, 11, 11],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0, 0, 0, 0],
						[1, 1, 1, 1, 1, 1, 1, 1],
						[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
						for (let i = 0; i < temp.length; i++) {
							for (let j = 0; j < temp[i].length; j++) {
								temp[i][j] = newState.positions[newState.position_index][i][j]
							}
						}
						newState.curPosition = temp
						return newState
					})
				}
			}
		}
	}

	cancelMove() {
		if (this.state.old_image_value !== 0) {
			this.setState((prevState) => {
				let newState = prevState
				newState.curPosition[newState.old_image_position[0]][newState.old_image_position[1]] = newState.old_image_value
				newState.dragging = false
				newState.current_image = null
				newState.old_image_value = 0
				return newState
			})
		}
	}

	put_piece_on_board(new_location, value) {
		let row = 8 - parseInt(new_location[1])
		let column = (new_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

		this.setState((prevState) => {
			let newState = prevState
			let temp = [[15, 13, 13.5, 19, 14, 13.5, 13, 15],
			[11, 11, 11, 11, 11, 11, 11, 11],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0],
			[1, 1, 1, 1, 1, 1, 1, 1],
			[5, 3, 3.5, 9, 4, 3.5, 3, 5]]
			for (let i = 0; i < temp.length; i++) {
				for (let j = 0; j < temp[i].length; j++) {
					temp[i][j] = newState.curPosition[i][j]
				}
			}
			temp[row][column] = value
			newState.positions = newState.positions.concat([temp])
			newState.curPosition = temp
			return newState
		})
	}

	makeMove(prev_location, new_location) {
		let row = 8 - parseInt(prev_location[1])
		let column = (prev_location[0]).charCodeAt(0) - ("a").charCodeAt(0)

		this.put_piece_on_board(new_location, this.state.curPosition[row][column])
		try {
			this.put_piece_on_board(prev_location, 0)
		} catch (error) {

		}
	}

	getMoveNumber(){
		return this.state.positions.length
	}
}


export default Board