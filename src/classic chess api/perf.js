import { PrMove } from "./io.js"
import { MakeMove, TakeMove } from "./makeMove.js"
import { GenerateMoves } from "./movegen.js"
import {BOOL} from "./defs.js"
import GameBoard from "./board.js"

let perft_leafNodes

function Perft(depth) {
	if (depth == 0) {
		perft_leafNodes++
		return
	}

	GenerateMoves()

	let index
	let move

	for (index = GameBoard.moveListStart[GameBoard.ply]; index < GameBoard.moveListStart[GameBoard.ply + 1]; ++index) {

		move = GameBoard.moveList[index]
		if (MakeMove(move) == BOOL.FALSE) {
			continue
		}
		Perft(depth - 1)
		TakeMove()
	}

	return
}

export const PerftTest = (depth) => {
	GameBoard.PrintBoard();
	console.log("Starting Test To Depth:" + depth);
	perft_leafNodes = 0;

	GenerateMoves();

	let index;
	let move;
	let moveNum = 0;
	for (
		index = GameBoard.moveListStart[GameBoard.ply];
		index < GameBoard.moveListStart[GameBoard.ply + 1];
		++index
	) {
		move = GameBoard.moveList[index];
		if (MakeMove(move) == BOOL.FALSE) {
			continue;
		}
		moveNum++;
		let cumnodes = perft_leafNodes;
		Perft(depth - 1);
		TakeMove();
		let oldnodes = perft_leafNodes - cumnodes;
		console.log("move:" + moveNum + " " + PrMove(move) + " " + oldnodes);
	}

	console.log("Test Complete : " + perft_leafNodes + " leaf nodes visited");

	return;
};