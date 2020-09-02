import { FROMSQ, TOSQ, PROMOTED, PIECES, FilesBrd, RanksBrd, RankChar, FileChar, PieceKnight, PieceRookQueen, PieceBishopQueen,  } from "./defs.js"

export function PrSq(a_square_120) {
	return (FileChar[FilesBrd[a_square_120]] + RankChar[RanksBrd[a_square_120]])
}

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
