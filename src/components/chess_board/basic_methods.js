import React from "react"

class buffer_class {
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
		if (this.state.are_images_loaded) {
			const canvas = this.chess_board_canvas.current
			this.put_starting_pieces_on_board(canvas)
		}
	}

	render() {
		const styling = { height: this.state.canvas_height, width: this.state.canvas_width, border: "solid" }
		return (
			<div>
				<canvas id="chess_board" style={styling} ref={this.chess_board_canvas}></canvas>
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
		for (let r = 0; r < this.state.position.length; r++) {
			for (let c = 0; c < this.state.position[r].length; c++) {
				this.put_piece_at(c + 1, r + 1, this.state.img_dict[this.piece_to_pice_val_dict[this.state.position[7 - r][c]]], this.state.position[7 - r][c])
			}
		}
	}
}

export default buffer_class