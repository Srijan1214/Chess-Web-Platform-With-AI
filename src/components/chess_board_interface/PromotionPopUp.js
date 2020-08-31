import React from "react"
import "./PromotionPopUpStyles.css"

class PromotionPopUp extends React.Component {
	constructor(props) {
		super(props)
		this._canvas = React.createRef()
		this.user_color = props.user_color //which side view's the board
		this.state = {
			img_dict: {},
			are_images_loaded: false,
			first_load: 0,
			promotion_selection_visibility: false,
			file_number: 1,
		}
		this.outside_div_mouse_click_handler = this.outside_div_mouse_click_handler.bind(this)
	}

	render() {
		const div_class = this.state.promotion_selection_visibility
			? ""
			: "none_display"
		const canvas_class = "promotion_selection_class_" + this.state.file_number

		return (
			<div
				style={{
					height: this.props.height,
					width: this.props.width,
					position: "absolute",
					top: 0,
				}}
				className={div_class}
				onClick = {this.outside_div_mouse_click_handler}
			>
				<canvas
					id="pop_up_canvas"
					style={{
						height: this.props.height / 2,
						width: this.props.width / 8,
						top: this.props.height / 8,
						borderRadius: "1em",
					}}
					className={canvas_class}
					ref={this._canvas}
				></canvas>
			</div>
		)
	}

	ShowPromotionSelectionMenu(file_number = 1) {
		if (file_number < 1) file_number = 1
		if (file_number > 8) file_number = 8
		file_number=Math.floor(file_number)

		const newState = {}
		newState.file_number = file_number
		newState.promotion_selection_visibility = true
		this.setState(newState)
	}

	HidePromotionSelectionMenu() {
		const newState = {}
		newState.promotion_selection_visibility = false
		this.setState(newState)
	}


	componentDidMount() {
		this.LoadImagesFromServer()
		const canvas = this._canvas.current
		const dpi = window.devicePixelRatio;
		function fix_dpi() {
			const style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
			const style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
			canvas.setAttribute('height', style_height * dpi);
			canvas.setAttribute('width', style_width * dpi);
		}
		fix_dpi()
		// Draw
	}

	componentDidUpdate() {
		const canvas = this._canvas.current
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		// Draw
		if (this.state.are_images_loaded) {
			// Draw Pieces
			this.FillCanvasWithPieceImages(canvas)
		}
	}

	LoadImagesFromServer() {
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

			this.setState({
				img_dict: img_dict,
				are_images_loaded : true,
				first_load: this.state.first_load + 1
			})
		}))
	}

	FillCanvasWithPieceImages(canvas) {
		if (this.props.GetUserColor() === 0) {
			this.PutPieceImageAt(1, this.state.img_dict["white_queen"])
			this.PutPieceImageAt(2, this.state.img_dict["white_rook"])
			this.PutPieceImageAt(3, this.state.img_dict["white_bish"])
			this.PutPieceImageAt(4, this.state.img_dict["white_knight"])
		} else if (this.props.GetUserColor() === 1) {
			this.PutPieceImageAt(1, this.state.img_dict["black_queen"])
			this.PutPieceImageAt(2, this.state.img_dict["black_rook"])
			this.PutPieceImageAt(3, this.state.img_dict["black_bish"])
			this.PutPieceImageAt(4, this.state.img_dict["black_knight"])
		}
	}

	PutPieceImageAt(n, img) {
		const canvas = this._canvas.current
		const dx = canvas.width 
		const dy = canvas.height / 4

		const ctx = canvas.getContext("2d")

		ctx.drawImage(img, 0, (n - 1) * dy, dx, dy)
	}

	outside_div_mouse_click_handler(event) {
		let rect = event.currentTarget.getBoundingClientRect();
		let x = event.clientX - rect.left;
		let y = event.clientY - rect.top;
		const get_piece_number = (x, y) => {
			const canvas = this._canvas.current
			const dx = canvas.width
			const dy = canvas.height / 4

			const common_start_cord_x = (this.state.file_number - 1) * dx
			const queen_start_cord_y = (dy * 1)
			const rook_start_cord_y = (dy * 2)
			const bish_start_cord_y = (dy * 3)
			const knight_start_cord_y = (dy * 4)

			const check_if_inside_rectangle = (x, y, rect_x, rect_y, dx, dy) => {
				if (
					x >= rect_x &&
					x <= rect_x + dx &&
					y >= rect_y &&
					y <= rect_y + dy
				) {
					return true
				} else {
					return false
				}
			}

			let piece_value = -1
			if(check_if_inside_rectangle(x, y, common_start_cord_x, queen_start_cord_y, dx, dy)) {
				piece_value = 9
			}else if(check_if_inside_rectangle(x, y, common_start_cord_x, rook_start_cord_y, dx, dy)) {
				piece_value = 5
			}else if(check_if_inside_rectangle(x, y, common_start_cord_x, bish_start_cord_y, dx, dy)) {
				piece_value = 3.5
			}else if(check_if_inside_rectangle(x, y, common_start_cord_x, knight_start_cord_y, dx, dy)) {
				piece_value = 3
			}else {
				piece_value = -1
				this.props.CallbackCancelPromotionLayout()
			}
			if (piece_value !== -1){
				if (this.props.GetUserColor() === 1) {
					piece_value += 10
				}
				this.props.CallbackInsertPromotionPiece(piece_value, this.state.file_number)
				this.HidePromotionSelectionMenu()
			}
		}

		get_piece_number(x, y)
	}

}

export default PromotionPopUp
