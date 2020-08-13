import React from "react"
import Board from "./Board"
import PromotionPopUp from "./PromotionPopUp"
import './GameBoardWrapperStyle.css'

class GameBoardWrapper extends React.Component {
	constructor(props) {
		super(props)
		this.width = props.width
		this.height = Math.floor((props.height * 100) / 90)
		this._board = React.createRef()
		this._PromotionPopUp = React.createRef()
		this.state = {
			game_end_menu_visibility: false,
			game_end_text: "",
		}
		this.show_end_game_menu_bar = this.show_end_game_menu_bar.bind(this)
	}

	render() {
		return (
			<div
				className="board_canvas_wrapper bordered"
				style={{ height: this.height, width: this.width }}
			>
				<Board
					height={this.props.height}
					width={this.props.width}
					user_color={this.props.user_color}
					ref={this._board}
					callback_to_indicate_move_is_played={
						this.props.callback_to_indicate_move_is_played
					}
					get_move_status={this.props.get_move_status}
				/>
				<div
					className={
						this.state.game_end_menu_visibility
							? ""
							: "none_display"
					}
				>
					<div style={{height:this.props.height}} className="opaque_filler bordered"><span>{this.state.game_end_text}</span></div>
				</div>
				<PromotionPopUp
					width={this.props.width}
					height={this.props.height}
					user_color={this.props.user_color}
					ref={this._PromotionPopUp}
					callback_insert_promotion_piece={this.props.callback_insert_promotion_piece}
					callback_cancel_promotion_layout={this.props.callback_cancel_promotion_layout}
				></PromotionPopUp>
				<div className="bottom_interface_container"> 
					<div className={"bottom_buttons_container " +
						(this.state.game_end_menu_visibility
						? "none_display"
						: "")}
					>
						<button className="bottom_button" onClick={this.props.callback_buttonclick_offer_draw}> Offer Draw </button>
						<button className="bottom_button" onClick={this.props.callback_buttonclick_takeback}> Take Back </button>
						<button className="bottom_button" onClick={this.props.callback_buttonclick_resign}> Resign </button>
					</div>
					<div className={"bottom_buttons_container " +
						(this.state.game_end_menu_visibility
						? ""
						: "none_display")}
					>
						<button className="bottom_button" onClick={this.props.callback_buttonclick_restart_game}> Restart Game </button>
						<button className="bottom_button"> Analyze Game </button>
						<button className="bottom_button"> Home Page </button>
					</div>
				</div>
			</div>
		)
	}

	show_end_game_menu_bar() {
		const newState = {}
		newState.game_end_menu_visibility = true
		this.setState(newState)
	}

	hide_end_game_menu_bar() {
		const newState = {}
		newState.game_end_menu_visibility = false
		this.setState(newState)
	}

	show_promotion_selection_menu(file_number) {
		this._PromotionPopUp.current.show_promotion_selection_menu(file_number)
	}

	hide_promotion_selection_menu() {
		this._PromotionPopUp.current.hide_promotion_selection_menu()
	}

	set_game_end_message(message) {
		const newState = {}
		newState.game_end_text = message
		this.setState(newState)
	}

}

export default GameBoardWrapper
