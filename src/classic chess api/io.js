import { FROMSQ, TOSQ, PROMOTED, PIECES, BOOL, FilesBrd, RanksBrd, RankChar, FileChar, PieceKnight, PieceRookQueen, PieceBishopQueen,  } from "./defs.js"

export function PrSq(sq) {
	return (FileChar[FilesBrd[sq]] + RankChar[RanksBrd[sq]])
}

export function PrMove (move) {
	let MvStr;

	const ff = FilesBrd[FROMSQ(move)];
	const rf = RanksBrd[FROMSQ(move)];
	const ft = FilesBrd[TOSQ(move)];
	const rt = RanksBrd[TOSQ(move)];

	MvStr = FileChar[ff] + RankChar[rf] + FileChar[ft] + RankChar[rt];

	let promoted = PROMOTED(move);
	// console.log('promoted = ' + promoted)
	if (promoted !== PIECES.EMPTY) {
		let pchar = "q";
		if (PieceKnight[promoted] === BOOL.TRUE) {
			pchar = "n";
		} else if (
			PieceRookQueen[promoted] === BOOL.TRUE &&
			PieceBishopQueen[promoted] === BOOL.FALSE
		) {
			pchar = "r";
		} else if (
			PieceRookQueen[promoted] === BOOL.FALSE &&
			PieceBishopQueen[promoted] === BOOL.TRUE
		) {
			pchar = "b";
		}
		MvStr += pchar;
	}
	return MvStr;
};

export function PrintMoveList() {
	let index
	let move
	let num = 1
	console.log('MoveList:')

	for (index = this.moveListStart[this.ply]; index < this.moveListStart[this.ply + 1]; index++) {
		move = this.moveList[index]
		console.log('Move:' + num + ':' + this.PrMove(move))
		num++
	}
}
