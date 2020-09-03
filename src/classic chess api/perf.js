/**/
/* 
	 * FILE DESCRIPTION: 
	 * This file contains functions that help check for errors in the move list generation.
	 * I can call the GenerateMove() funtion in tricky positions(using SetFen()) with many edge cases
	 * and these functions will generate the total number of nodes. If everything is correct 
	 * the value should be the same for as the one gotten through another chess tool that I used.
*/
/**/
import { PrMove } from "./io.js"
import { MakeMove, TakeMove } from "./makeMove.js"
import { GenerateMoves } from "./movegen.js"
import GameBoard from "./board.js"

let perft_leafNodes







 /**/
/*
NAME : GameBoard.Perft()- Gets the total number of legal moves in all sub variations up till a certain depth. 

SYNOPSIS : Perft(a_depth)
			a_depth -> The depth to which the number of nodes are calculated.

DESCRIPTION 
			Gets the total number of legal moves in all sub variations up till a certain depth. 

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/15/2020

*/
/**/
function Perft(a_depth) {
	if (a_depth == 0) {
		perft_leafNodes++
		return
	}

	GenerateMoves()

	let index
	let move

	for (index = GameBoard.m_moveListStart[GameBoard.m_ply]; index < GameBoard.m_moveListStart[GameBoard.m_ply + 1]; ++index) {

		move = GameBoard.m_moveList[index]
		if (MakeMove(move) == false) {
			continue
		}
		Perft(a_depth - 1)
		TakeMove()
	}

	return
}
/* Perft(a_depth) */






 /**/
/*
NAME : GameBoard.PerftTest(a=)- Gets the total number of legal moves up till a certain depth and prints it. 

SYNOPSIS : PerftTest(a_depth)
			a_depth -> The depth to which the number of nodes are calculated.

DESCRIPTION 
			Gets the total number of legal moves in all sub variations up till a certain depth. 
			Prints it to the console.
			If anything is wrong in the implementation, a wrong number will be printed.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/15/2020

*/
/**/
export const PerftTest = (a_depth) => {
	GameBoard.PrintBoard();
	console.log("Starting Test To Depth:" + a_depth);
	perft_leafNodes = 0;

	GenerateMoves();

	let index;
	let move;
	let moveNum = 0;
	for (
		index = GameBoard.m_moveListStart[GameBoard.m_ply];
		index < GameBoard.m_moveListStart[GameBoard.m_ply + 1];
		++index
	) {
		move = GameBoard.m_moveList[index];
		if (MakeMove(move) == false) {
			continue;
		}
		moveNum++;
		let cumnodes = perft_leafNodes;
		Perft(a_depth - 1);
		TakeMove();
		let oldnodes = perft_leafNodes - cumnodes;
		console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
	}

	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");

	return;
};
/* PerftTest (a_depth) */
