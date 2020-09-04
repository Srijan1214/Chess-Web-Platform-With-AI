/**/
/* 
	 * FILE DESCRIPTION: 
	 * These function perform castle moves on the board interface.
	 * Thought it was a good idea to separate them out.
*/
/**/


import {
	Get_Black_King_Side_Castle_Array,
	Get_White_King_Side_Castle_Array,
	Get_Black_Queen_Side_Castle_Array,
	Get_White_Queen_Side_Castle_Array,
} from "../../utility_functions/Utility.js"

// the following functions clears all the pieces 
// in the way to allow for castlings







 /**/
/*
NAME : GameBoard.PerformWhiteKingSideCastle() - Performs a white king side castle on the position.

SYNOPSIS : PerformWhiteKingSideCastle()

DESCRIPTION 
			Performs a white king side castle on the position.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/06/2020

*/
/**/
export function PerformWhiteKingSideCastle() {
	const newState = {}
	newState.curPosition = Get_White_King_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}
/* PerformWhiteKingSideCastle() */







 /**/
/*
NAME : GameBoard.PerformWhiteQueenSideCastle() -Performs a white queen side castle on the position. 

SYNOPSIS : PerformWhiteQueenSideCastle()

DESCRIPTION 
			Performs a white queen side castle on the position.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/06/2020

*/
/**/
export function PerformWhiteQueenSideCastle() {
	const newState = {}
	newState.curPosition= Get_White_Queen_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}
/* PerformWhiteQueenSideCastle() */







 /**/
/*
NAME : GameBoard.PerformBlackKingSideCastle() - Performs a black king side castle on the position.

SYNOPSIS : PerformBlackKingSideCastle()

DESCRIPTION 
			Performs a black king side castle on the position.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/06/2020

*/
/**/
export function PerformBlackKingSideCastle() {
	const newState = {}
	newState.curPosition = Get_Black_King_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}
/* PerformBlackKingSideCastle() */







 /**/
/*
NAME : GameBoard.PerformBlackQueenSideCastle() - Performs a black queen side castle on the position.

SYNOPSIS : PerformBlackQueenSideCastle()

DESCRIPTION 
			Performs a black queen side castle on the position.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/06/2020

*/
/**/
export function PerformBlackQueenSideCastle() {
	const newState = {}
	newState.curPosition = Get_Black_Queen_Side_Castle_Array(this.state.curPosition)
	this.setState(newState)
}
/* PerformBlackQueenSideCastle() */
