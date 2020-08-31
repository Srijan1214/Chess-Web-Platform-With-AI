import React from "react"
import BoardInterface from "./BoardInterface"
import PromotionPopUp from "./PromotionPopUp"
import './GameBoardWrapperStyle.css'

class GameBoardWrapper extends React.Component {
	constructor(props) {
		super(props)
		this.width = props.width * 1.20
		this.height = Math.floor((props.height * 100) / 90)
		this._board = React.createRef()
		this._PromotionPopUp = React.createRef()
		this.state = {
			game_end_menu_visibility: false,
			game_end_text: "",
			restart_button_confirmation_visibility: false,
			radio_button_user_color: 0,
		}
		this.show_end_game_menu_bar = this.show_end_game_menu_bar.bind(this)
		this.hide_end_game_menu_bar = this.hide_end_game_menu_bar.bind(this)
		this.show_promotion_selection_menu = this.show_promotion_selection_menu.bind(this)
		this.hide_promotion_selection_menu = this.hide_promotion_selection_menu.bind(this)
		this.show_restart_game_confirmation = this.show_restart_game_confirmation.bind(this)
		this.hide_restart_game_confirmation = this.hide_restart_game_confirmation.bind(this)
		this.radio_button_change_listener = this.radio_button_change_listener.bind(this)
		this.restart_button_handler = this.restart_button_handler.bind(this)
	}

	render() {
		return (
			<div
				className="board_canvas_wrapper bordered"
				style={{ height: this.height, width: this.width }}
			>
				<BoardInterface
					height={this.props.height}
					width={this.props.width}
					user_color={this.props.user_color}
					get_user_color={this.props.get_user_color}
					ref={this._board}
					callback_to_indicate_move_is_played={
						this.props.callback_to_indicate_move_is_played
					}
					GetMoveStatus={this.props.GetMoveStatus}
				/>
				<div
					className={
						this.state.game_end_menu_visibility
							? ""
							: "none_display"
					}
				>
					<div style={{height:this.props.height, width:this.props.width}} className="opaque_filler bordered"><span>{this.state.game_end_text}</span></div>
				</div>
				<PromotionPopUp
					width={this.props.width}
					height={this.props.height}
					user_color={this.props.user_color}
					get_user_color={this.props.get_user_color}
					ref={this._PromotionPopUp}
					callback_insert_promotion_piece={this.props.callback_insert_promotion_piece}
					callback_cancel_promotion_layout={this.props.callback_cancel_promotion_layout}
				></PromotionPopUp>
				<div className="bottom_interface_container"> 
					<div className={"bottom_buttons_container " +
						(this.state.game_end_menu_visibility
						? "none_display"
						: "")}
						style={{width:this.props.width}}
					>
						<button className="bottom_button button_highlight_on_hover" onClick={this.props.callback_buttonclick_offer_draw}> Offer Draw </button>
						<button className="bottom_button button_highlight_on_hover" onClick={this.props.callback_buttonclick_takeback}> Take Back </button>
						<button className="bottom_button button_highlight_on_hover" onClick={this.props.callback_buttonclick_resign}> Resign </button>
					</div>
					<div className={"bottom_buttons_container " +
						(this.state.game_end_menu_visibility
						? ""
						: "none_display")}
						style={{width:this.props.width}}
					>
					</div>
				</div>
				<div
					className = "side_select_menu_container"
					style={{width:0.2 * this.props.width}}
				>
					<div style= {{color:"grey", fontSize:"large"}}> <b> <u>Select Side</u> </b></div>
					<div style= {{color: "grey", margin:"18%"}} onChange={this.radio_button_change_listener}>
						<div>
							<input type="radio" id="white_radio_id" name="color" value="White" defaultChecked={this.props.get_user_color() === 0}></input>
							<label htmlFor="white_radio_id">White</label>
						</div>
						<div>
							<input type="radio" id="black_radio_id" name="color" value="Black" defaultChecked={this.props.get_user_color() === 1}></input>
							<label htmlFor="black_radio_id">Black</label>
						</div>
					</div>


					<div style={{ width:"100%", textAlign:"center" }}>
						<div className = {this.state.restart_button_confirmation_visibility ? "none_display" : ""}>
							<button className="bottom_button button_highlight_on_hover" style={{width:"90%", height:0.6 * 0.1 *this.props.height, marginTop:"14%",}} 
								onClick={this.restart_button_handler}> Restart Game </button>
						</div>
						<div style={{width:"100%"}} className = {this.state.restart_button_confirmation_visibility ? "" : "none_display"}>
							<button className="confirmation_button_left_side button_highlight_on_hover" style={{width:"45%", height:0.6 * 0.1 *this.props.height, marginTop:"14%"}}
								onClick={this.hide_restart_game_confirmation}>✕</button>
							<button className="confirmation_button_right_side button_highlight_on_hover" style={{width:"45%", height:0.6 * 0.1 *this.props.height, marginTop:"14%"}}
								onClick={() => {this.props.callback_buttonclick_restart_game(); this.hide_restart_game_confirmation()}}>
								✓
							</button>
						</div>
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

	show_restart_game_confirmation () {
		const newState = {}
		newState.restart_button_confirmation_visibility = true
		this.setState(newState)
	}
	
	hide_restart_game_confirmation () {
		const newState = {}
		newState.restart_button_confirmation_visibility = false
		this.setState(newState)
	}

	set_game_end_message(message) {
		const newState = {}
		newState.game_end_text = message
		this.setState(newState)
	}

	restart_button_handler() {
		if(this.state.game_end_menu_visibility) {
			this.props.callback_buttonclick_restart_game()
		}else {
			this.show_restart_game_confirmation()
		}
	}

	radio_button_change_listener (event) {
		const newState = {}
		if (event.target.value === "White") {
			newState.radio_button_user_color = 0
		} else {
			newState.radio_button_user_color = 1
		}
		this.setState(newState)
	}

}

export default GameBoardWrapper
