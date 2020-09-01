import React from "react"
import BoardInterface from "./BoardInterface"
import PromotionPopUp from "./PromotionPopUp"
import './GameBoardWrapperStyle.css'

class GameBoardInterfaceWrapper extends React.Component {
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
		this.ShowEndGameMenuBar = this.ShowEndGameMenuBar.bind(this)
		this.HideEndGameMenuBar = this.HideEndGameMenuBar.bind(this)
		this.ShowPromotionSelectionMenu = this.ShowPromotionSelectionMenu.bind(this)
		this.HidePromotionSelectionMenu = this.HidePromotionSelectionMenu.bind(this)
		this.ShowRestartGameConfirmation = this.ShowRestartGameConfirmation.bind(this)
		this.HideRestartGameConfirmation = this.HideRestartGameConfirmation.bind(this)
		this.RadioButtonChangeListener = this.RadioButtonChangeListener.bind(this)
		this.RestartButtonHandler = this.RestartButtonHandler.bind(this)
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
					GetUserColor={this.props.GetUserColor}
					ref={this._board}
					CallbackToIndicateMoveIsPlayed={
						this.props.CallbackToIndicateMoveIsPlayed
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
					GetUserColor={this.props.GetUserColor}
					ref={this._PromotionPopUp}
					CallbackInsertPromotionPiece={this.props.CallbackInsertPromotionPiece}
					CallbackCancelPromotionLayout={this.props.CallbackCancelPromotionLayout}
				></PromotionPopUp>
				<div className="bottom_interface_container"> 
					<div className={"bottom_buttons_container " +
						(this.state.game_end_menu_visibility
						? "none_display"
						: "")}
						style={{width:this.props.width}}
					>
						<button className="bottom_button button_highlight_on_hover" onClick={this.props.CallbackButtonclickOfferDraw}> Offer Draw </button>
						<button className="bottom_button button_highlight_on_hover" onClick={this.props.CallbackButtonclickTakeback}> Take Back </button>
						<button className="bottom_button button_highlight_on_hover" onClick={this.props.CallbackButtonclickResign}> Resign </button>
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
					<div style= {{color: "grey", margin:"18%"}} onChange={this.RadioButtonChangeListener}>
						<div>
							<input type="radio" id="white_radio_id" name="color" value="White" defaultChecked={this.props.GetUserColor() === 0}></input>
							<label htmlFor="white_radio_id">White</label>
						</div>
						<div>
							<input type="radio" id="black_radio_id" name="color" value="Black" defaultChecked={this.props.GetUserColor() === 1}></input>
							<label htmlFor="black_radio_id">Black</label>
						</div>
					</div>


					<div style={{ width:"100%", textAlign:"center" }}>
						<div className = {this.state.restart_button_confirmation_visibility ? "none_display" : ""}>
							<button className="bottom_button button_highlight_on_hover" style={{width:"90%", height:0.6 * 0.1 *this.props.height, marginTop:"14%",}} 
								onClick={this.RestartButtonHandler}> Restart Game </button>
						</div>
						<div style={{width:"100%"}} className = {this.state.restart_button_confirmation_visibility ? "" : "none_display"}>
							<button className="confirmation_button_left_side button_highlight_on_hover" style={{width:"45%", height:0.6 * 0.1 *this.props.height, marginTop:"14%"}}
								onClick={this.HideRestartGameConfirmation}>✕</button>
							<button className="confirmation_button_right_side button_highlight_on_hover" style={{width:"45%", height:0.6 * 0.1 *this.props.height, marginTop:"14%"}}
								onClick={() => {this.props.CallbackButtonclickRestartGame(); this.HideRestartGameConfirmation()}}>
								✓
							</button>
						</div>
					</div>

				</div>
			</div>
		)
	}

	ShowEndGameMenuBar() {
		const newState = {}
		newState.game_end_menu_visibility = true
		this.setState(newState)
	}

	HideEndGameMenuBar() {
		const newState = {}
		newState.game_end_menu_visibility = false
		this.setState(newState)
	}

	ShowPromotionSelectionMenu(a_file_number) {
		this._PromotionPopUp.current.ShowPromotionSelectionMenu(a_file_number)
	}

	HidePromotionSelectionMenu() {
		this._PromotionPopUp.current.HidePromotionSelectionMenu()
	}

	ShowRestartGameConfirmation () {
		const newState = {}
		newState.restart_button_confirmation_visibility = true
		this.setState(newState)
	}
	
	HideRestartGameConfirmation () {
		const newState = {}
		newState.restart_button_confirmation_visibility = false
		this.setState(newState)
	}

	SetGameEndMessage(a_message) {
		const newState = {}
		newState.game_end_text = a_message
		this.setState(newState)
	}

	RestartButtonHandler() {
		if(this.state.game_end_menu_visibility) {
			this.props.CallbackButtonclickRestartGame()
		}else {
			this.ShowRestartGameConfirmation()
		}
	}

	RadioButtonChangeListener (a_event) {
		const newState = {}
		if (a_event.target.value === "White") {
			newState.radio_button_user_color = 0
		} else {
			newState.radio_button_user_color = 1
		}
		this.setState(newState)
	}

}

export default GameBoardInterfaceWrapper
