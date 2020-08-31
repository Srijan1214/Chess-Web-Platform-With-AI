import {
	Get_Black_King_Side_Castle_Array,
	Get_White_King_Side_Castle_Array,
	Get_Black_Queen_Side_Castle_Array,
	Get_White_Queen_Side_Castle_Array,
} from "../../utility_functions/Utility.js"

// the following functions clears all the pieces 
// in the way to allow for castlings

export function PerformWhiteKingSideCastle() {
	const newState = {}
	newState.curPosition = Get_White_King_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}

export function PerformWhiteQueenSideCastle() {
	const newState = {}
	newState.curPosition= Get_White_Queen_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}

export function PerformBlackKingSideCastle() {
	const newState = {}
	newState.curPosition = Get_Black_King_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}

export function PerformBlackQueenSideCastle() {
	const newState = {}
	newState.curPosition = Get_Black_Queen_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}