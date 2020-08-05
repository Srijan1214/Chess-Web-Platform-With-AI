import React, { createRef } from "react"
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
			promotion_selection_visibility: false,
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
					<div class="opaque_filler"></div>
					<div>
						<div class="button_wrapper" id="restart_id">
							<button class="canvas_button">START GAME</button>
						</div>
						<div class="button_wrapper" id="analyze_id">
							<button class="canvas_button">
								ANALYSIS BOARD
							</button>
						</div>
						<div class="button_wrapper" id="main_page_id">
							<button class="canvas_button">MAIN PAGE</button>
						</div>
					</div>
				</div>
				<PromotionPopUp
					width={this.props.width}
					height={this.props.height}
					ref={this._PromotionPopUp}
					callback_insert_promotion_piece={this.props.callback_insert_promotion_piece}
				></PromotionPopUp>
				<div id="draw_resign_div_id">
					<button className="draw_resign_button"> Offer Draw </button>
					<button className="draw_resign_button"> Resign </button>
				</div>
			</div>
		)
	}

	show_end_game_menu_bar() {
		const newState = {}
		newState.game_end_menu_visibility = true
		this.setState(newState)
	}

	show_promotion_selection_menu(file_number) {
		this._PromotionPopUp.current.show_promotion_selection_menu(file_number)
	}

}

export default GameBoardWrapper
