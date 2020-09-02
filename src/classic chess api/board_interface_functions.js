/**/
/*

FILE DESCRIPTION: Contains useful functions to anyone using the GameBoard class.

*/
/**/


import { START_FEN } from "./defs.js"


/**/
/*
NAME : GameBoard.TakeBack_Move() - Takes back the most recent move.

SYNOPSIS : TakeBack_Move()

DESCRIPTION 
			Takes back the most recent move. Will do nothing if in starting position.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 08/04/2020

*/
/**/
export function TakeBack_Move() {
	if(this.m_hisPly > 0) {
		this.TakeMove()
		this.m_ply = 0
	}
}
/* TakeBack_Move() */



/**/
/*
NAME : GameBoard.Set_Board_To_Start_Position() - Sets the Game Board to the standard start position.

SYNOPSIS : Set_Board_To_Start_Position()

DESCRIPTION 
			Sets the Game Board to the standard start position.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 08/04/2020

*/
/**/
export function Set_Board_To_Start_Position() {
	this.ParseFen(START_FEN)
}
/* Set_Board_To_Start_Position() */