/**/
/* 
	 * FILE DESCRIPTION: 
	 * A wrapper for the plain board interface from the BoarInterface.js.
	 * It provides the promotion pop us menu and additional buttons for a complete chess game.
*/
/**/
import React from "react"
import BoardInterface from "./BoardInterface"
import PromotionPopUp from "./PromotionPopUp"
import './GameBoardWrapperStyle.css'

// The class definitions for the GameBoardInterfaceWrapper
class GameBoardInterfaceWrapper extends React.Component {
	 /**/
	/*
	NAME : GameBoard.constructor() - Sets necessary variables and binds the button click functions to the class.

	SYNOPSIS : constructor(props)
				props -> The props object.

	DESCRIPTION 
				Sets necessary variables and binds the button click functions to the class.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
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
	/* constructor(props) */








	 /**/
	/*
	NAME : GameBoard.render() - A standard ReactJS render function.

	SYNOPSIS : render()

	DESCRIPTION 
				A standard ReactJS render function.

	RETURNS : A JSX object that contains the html style parameters.

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
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
	/* render() */








	 /**/
	/*
	NAME : GameBoard.ShowEndGameMenuBar() - Shows the game end screen.

	SYNOPSIS : ShowEndGameMenuBar()

	DESCRIPTION 
				Shows the game end screen.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
	ShowEndGameMenuBar() {
		const newState = {}
		newState.game_end_menu_visibility = true
		this.setState(newState)
	}
	/* ShowEndGameMenuBar() */








	 /**/
	/*
	NAME : GameBoard.HideEndGameMenuBar() - Hides the game end screen.

	SYNOPSIS : HideEndGameMenuBar()

	DESCRIPTION 
				Hides the game end screen.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
	HideEndGameMenuBar() {
		const newState = {}
		newState.game_end_menu_visibility = false
		this.setState(newState)
	}
	/* HideEndGameMenuBar() */








	 /**/
	/*
	NAME : GameBoard.ShowPromotionSelectionMenu() - Shows the promotion selection menu.

	SYNOPSIS : ShowPromotionSelectionMenu(a_file_number)
				a_file_number -> The file at which to display the menu.

	DESCRIPTION 
				Shows the promotion selection menu.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
	ShowPromotionSelectionMenu(a_file_number) {
		this._PromotionPopUp.current.ShowPromotionSelectionMenu(a_file_number)
	}
	/* ShowPromotionSelectionMenu(a_file_number) */








	 /**/
	/*
	NAME : GameBoard.HidePromotionSelectionMenu() - Hides the promotion selection menu.

	SYNOPSIS : HidePromotionSelectionMenu()

	DESCRIPTION 
				Hides the promotion selection menu.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
	HidePromotionSelectionMenu() {
		this._PromotionPopUp.current.HidePromotionSelectionMenu()
	}
	/* HidePromotionSelectionMenu() */








	 /**/
	/*
	NAME : GameBoard.ShowRestartGameConfirmation() - Displays the confirmation dialog for the restart game.

	SYNOPSIS : ShowRestartGameConfirmation()

	DESCRIPTION 
				Displays the confirmation dialog for the restart game.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
	ShowRestartGameConfirmation () {
		const newState = {}
		newState.restart_button_confirmation_visibility = true
		this.setState(newState)
	}
	/* ShowRestartGameConfirmation() */
	







	 /**/
	/*
	NAME : GameBoard.HideRestartGameConfirmation() - Displays the confirmation dialog for the restart game. 

	SYNOPSIS : HideRestartGameConfirmation()

	DESCRIPTION 
				Displays the confirmation dialog for the restart game.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/27/2020

	*/
	/**/
	HideRestartGameConfirmation () {
		const newState = {}
		newState.restart_button_confirmation_visibility = false
		this.setState(newState)
	}
	/* HideRestartGameConfirmation() */








	 /**/
	/*
	NAME : GameBoard.SetGameEndMessage() - Sets the game end message to the argument passed.

	SYNOPSIS : SetGameEndMessage(a_message)
				a_message -> The message string to be displayed when game ends.

	DESCRIPTION 
				Sets the game end message to the argument passed.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/17/2020

	*/
	/**/
	SetGameEndMessage(a_message) {
		const newState = {}
		newState.game_end_text = a_message
		this.setState(newState)
	}
	/* SetGameEndMessage(a_message) */








	 /**/
	/*
	NAME : GameBoard.RestartButtonHandler() - The restart button handler.

	SYNOPSIS : RestartButtonHandler()

	DESCRIPTION 
				Contains logic for what to do when the restart button is clicked.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/25/2020

	*/
	/**/
	RestartButtonHandler() {
		if(this.state.game_end_menu_visibility) {
			this.props.CallbackButtonclickRestartGame()
		}else {
			this.ShowRestartGameConfirmation()
		}
	}
	/* RestartButtonHandler() */








	 /**/
	/*
	NAME : GameBoard.RadioButtonChangeListener() - Listens for a change in the radio button.

	SYNOPSIS : RadioButtonChangeListener(a_event)

	DESCRIPTION 
				Listens for a change in the radio button.
				Sets the side chosen to the one in the radio button.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/20/2020

	*/
	/**/
	RadioButtonChangeListener (a_event) {
		const newState = {}
		if (a_event.target.value === "White") {
			newState.radio_button_user_color = 0
		} else {
			newState.radio_button_user_color = 1
		}
		this.setState(newState)
	}
	/* RadioButtonChangeListener(a_event) */

}

export default GameBoardInterfaceWrapper
