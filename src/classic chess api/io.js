/**/
/* 
	 * FILE DESCRIPTION: Functions helpful in debugging. They print was is going on to the console.
*/
/**/
import { FROMSQ, TOSQ, PROMOTED, PIECES, FilesBrd, RanksBrd, RankChar, FileChar, PieceKnight, PieceRookQueen, PieceBishopQueen,  } from "./defs.js"







 /**/
/*
NAME : GameBoard.PrSq() - Returns the square in terms of the standard chess coordinates.

SYNOPSIS : PrSq(a_square_120)
			a_square_120 -> The 120 Board index.

DESCRIPTION 
			Returns the square in terms of the standard chess coordinates.

RETURNS : The coordinate string (e.g 'a1', 'h4') given by the 120 board index.

AUTHOR : Srijan Prasad Joshi

DATE : 06/29/2020

*/
/**/
export function PrSq(a_square_120) {
	return (FileChar[FilesBrd[a_square_120]] + RankChar[RanksBrd[a_square_120]])
}
/* PrSq(a_square_120)*/







 /**/
/*
NAME : GameBoard.PrMove() - Returns the chess move in terms of the standard chess notation.

SYNOPSIS : PrMove(a_move_number)
			a_move_number -> The 32 bit move number encapsulating all the information needed for a move.
DESCRIPTION 
			Returns the chess move in terms of the standard chess notation.
			e.g. Returns 'a1' for an input of 21. 


RETURNS : the move in string format.

AUTHOR : Srijan Prasad Joshi

DATE : 06/29/2020

*/
/**/
export function PrMove (a_move_number) {
	let MvStr;

	const ff = FilesBrd[FROMSQ(a_move_number)];
	const rf = RanksBrd[FROMSQ(a_move_number)];
	const ft = FilesBrd[TOSQ(a_move_number)];
	const rt = RanksBrd[TOSQ(a_move_number)];

	MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];

	let promoted = PROMOTED(a_move_number);
	// console.log('promoted = ' + promoted)
	if (promoted !== PIECES.EMPTY) {
		let pchar = "q";
		if (PieceKnight[promoted] === true) {
			pchar = "n";
		} else if (
			PieceRookQueen[promoted] === true &&
			PieceBishopQueen[promoted] === false
		) {
			pchar = "r";
		} else if (
			PieceRookQueen[promoted] === false &&
			PieceBishopQueen[promoted] === true
		) {
			pchar = "b";
		}
		MvStr += pchar;
	}
	return MvStr;
};
/* PrMove(a_move_number)*/







 /**/
/*
NAME : GameBoard.PrintMoveList() - Console.logs all the legal moves in a given position.

SYNOPSIS : PrintMoveList()

DESCRIPTION 
			Console.logs all the legal moves in a given position.
			Does not take checks into consideration.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/29/2020

*/
/**/
export function PrintMoveList() {
	let index
	let move
	let num = 1
	console.log('MoveList:')

	for (index = this.m_moveListStart[this.m_ply]; index < this.m_moveListStart[this.m_ply + 1]; index++) {
		move = this.m_moveList[index]
		console.log('Move:' + num + ':' + this.PrMove(move))
		num++
	}
}
/* PrintMoveList()*/
