import React, { createRef } from "react"
import Board from "./Board"
import './GameBoardWrapperStyle.css'

class GameBoardWrapper extends React.Component {
	constructor(props) {
		super(props)
		this.width = props.width
		this.height = Math.floor((props.height * 100) / 90)
		this._board = React.createRef()
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
				<div className = "none_display">
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
				<div id= "draw_resign_div_id">
					<button className="draw_resign_button"> Offer Draw </button>
					<button className="draw_resign_button"> Resign </button>
				</div>
			</div>
		)
	}
}

export default GameBoardWrapper
