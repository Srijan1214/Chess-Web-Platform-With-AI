import React from "react"
import Board from "../components/chess_board/Board"

class PlayWithAIComponent extends React.Component{
	render() {
		return (
			<div>
				<Board height = {600} width = {600}/>
			</div>
		)
	}
}

export default PlayWithAIComponent