/**/
/* 
	 * FILE DESCRIPTION: 
	 * This file contains all the functions necessary for the promotion pop up menu when the user needs to
	 * promote a piece.
*/
/**/
import React from "react"
import "./PromotionPopUpStyles.css"

// The class definition of PromotionPopUp
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








	 /**/
	/*
	NAME : GameBoard.render() - A standard ReactJS render function.

	SYNOPSIS : render()

	DESCRIPTION 
				Renders the current promotion piece selection menu accordingly.

	RETURNS : A JSX object containing the div.

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

	*/
	/**/
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
	/* render() */








	 /**/
	/*
	NAME : GameBoard.ShowPromotionSelectionMenu() - Makes the promotion selection menu visible.

	SYNOPSIS : ShowPromotionSelectionMenu(a_file_number = 1)
				a_file_number -> The file in which to display the menu.

	DESCRIPTION 
				Makes the promotion selection menu visible.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

	*/
	/**/
	ShowPromotionSelectionMenu(a_file_number = 1) {
		if (a_file_number < 1) a_file_number = 1
		if (a_file_number > 8) a_file_number = 8
		a_file_number=Math.floor(a_file_number)

		const newState = {}
		newState.file_number = a_file_number
		newState.promotion_selection_visibility = true
		this.setState(newState)
	}
	/* ShowPromotionSelectionMenu(a_file_number = 1) */








	 /**/
	/*
	NAME : GameBoard.HidePromotionSelectionMenu() - Makes the promotion selection menu invisible.

	SYNOPSIS : HidePromotionSelectionMenu()

	DESCRIPTION 
				Makes the promotion selection menu invisible.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

	*/
	/**/
	HidePromotionSelectionMenu() {
		const newState = {}
		newState.promotion_selection_visibility = false
		this.setState(newState)
	}
	/* HidePromotionSelectionMenu() */









	 /**/
	/*
	NAME : GameBoard.componentDidMount() - A standard ReactJS componentDidMount method.

	SYNOPSIS : componentDidMount()

	DESCRIPTION 
				Loads the images from the server and fixes the DPI of the HTML canvas.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

	*/
	/**/
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
	/* componentDidMount() */








	 /**/
	/*
	NAME : GameBoard.componentDidUpdate() - Fills the menu with appropriate piece image.

	SYNOPSIS : componentDidUpdate()

	DESCRIPTION 
				Fills the menu with appropriate piece image if images are loaded successfully.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

	*/
	/**/
	componentDidUpdate() {
		const canvas = this._canvas.current
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		// Draw
		if (this.state.are_images_loaded) {
			// Draw Pieces
			this.FillCanvasWithPieceImages(canvas)
		}
	}
	/* componentDidUpdate() */








	 /**/
	/*
	NAME : GameBoard.LoadImagesFromServer() - Loads images from the server.

	SYNOPSIS : LoadImagesFromServer()

	DESCRIPTION 
				Loads images from the server and puts them inside this.state.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

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
			// img.src = "http://localhost:3001/resources/image/piece/" + piece;
			img.src = "https://wonderful-donkey-87.serverless.social/resources/image/piece/" + piece
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
	NAME : GameBoard.FillCanvasWithPieceImages() - Fills the canvas with appropriate piece images.

	SYNOPSIS : FillCanvasWithPieceImages()

	DESCRIPTION 
				Fills the canvas with appropriate piece images.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

	*/
	/**/
	FillCanvasWithPieceImages() {
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
	/* FillCanvasWithPieceImages() */








	 /**/
	/*
	NAME : GameBoard.PutPieceImageAt() - Helpful function to render image at a index.

	SYNOPSIS : PutPieceImageAt(a_row, a_img)
				a_row -> The index in which to render the image.
				a_img -> The HTML image object to render.

	DESCRIPTION 
				Helpful function to render image at a index.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

	*/
	/**/
	PutPieceImageAt(a_row, a_img) {
		const canvas = this._canvas.current
		const dx = canvas.width 
		const dy = canvas.height / 4

		const ctx = canvas.getContext("2d")

		ctx.drawImage(a_img, 0, (a_row - 1) * dy, dx, dy)
	}
	/* PutPieceImageAt(a_row, a_img) */








	 /**/
	/*
	NAME : GameBoard.outside_div_mouse_click_handler() - Removes the promotion selection menu if clicked outside it.

	SYNOPSIS : outside_div_mouse_click_handler(a_event)

	DESCRIPTION 
				Removes the promotion selection menu if clicked outside it.
				Also takes back the promotion move.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/21/2020

	*/
	/**/
	outside_div_mouse_click_handler(a_event) {
		let rect = a_event.currentTarget.getBoundingClientRect();
		let x = a_event.clientX - rect.left;
		let y = a_event.clientY - rect.top;
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
	/* outside_div_mouse_click_handler(a_event) */

}

export default PromotionPopUp
