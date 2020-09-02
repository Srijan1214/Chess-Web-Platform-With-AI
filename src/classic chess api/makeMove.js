/**/
/* 
	 * FILE DESCRIPTION: 
	 *	This file contains functions that facilitate making piece moves given a particular
	 *	position.
	 *	They also help in editing the GameBoard to manipulate which piece is where.
*/
/**/
import { PIECES, PCEINDEX, FROMSQ, TOSQ, MFLAGEP, COLOURS, MFLAGCA, SQUARES, CAPTURED, MFLAGPS, PROMOTED,
	PieceVal, PieceCol, Kings, CastlePerm, PiecePawn} from "./defs.js"







 /**/
/*
NAME : GameBoard.ClearPiece() - Clear the piece to an empty piece at a particular square

SYNOPSIS : ClearPiece(a_square_120)

DESCRIPTION 
			Clear the piece to an empty piece at a particular square.
			Reflects the necessary changes in all the arrays and variables that use that square.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/6/2020

*/
/**/
export function ClearPiece (a_square_120) {
	let pce = this.m_pieces[a_square_120];
	let col = PieceCol[pce];
	let index;
	let t_pceNum = -1;

	this.HASH_PCE(pce, a_square_120);

	this.m_pieces[a_square_120] = PIECES.EMPTY;
	this.m_material[col] -= PieceVal[pce];

	for (index = 0; index < this.m_pceNum[pce]; index++) {
		if (this.m_pList[PCEINDEX(pce, index)] === a_square_120) {
			t_pceNum = index;
			break;
		}
	}

	this.m_pceNum[pce]--;
	this.m_pList[PCEINDEX(pce, t_pceNum)] =
		this.m_pList[PCEINDEX(pce, this.m_pceNum[pce])];
}
/* ClearPiece(ClearPiece)*/







 /**/
/*
NAME : GameBoard.AddPiece() - Adds a piece to a particular square.

SYNOPSIS : AddPiece(a_square_120, a_piece)

DESCRIPTION 
			Add a piece to a square given the piece type and 120 Board square number.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/12/2020

*/
/**/
export function AddPiece (a_square_120, a_piece) {
	let col = PieceCol[a_piece];

	this.HASH_PCE(a_piece, a_square_120);

	this.m_pieces[a_square_120] = a_piece;
	this.m_material[col] += PieceVal[a_piece];
	this.m_pList[PCEINDEX(a_piece, this.m_pceNum[a_piece])] = a_square_120;
	this.m_pceNum[a_piece]++;
};
/* AddPiece(a_square_120, a_piece)*/







 /**/
/*
NAME : GameBoard.MovePiece() - Move the pieces from one square to another.

SYNOPSIS : MovePiece(a_from, a_to)
			a_from: The 120_Board array square number from which the move is made.
			a_to: The 120_Board array square number to which the move is made.

DESCRIPTION 
			Move the pieces from one square to another.
			Reflects necessary changes in all arrays and variables.
			Does not care if move is legal or not.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/12/2020

*/
/**/
export function MovePiece (a_from, a_to) {
	let index = 0
	let pce = this.m_pieces[a_from]

	this.HASH_PCE(pce, a_from)
	this.m_pieces[a_from] = PIECES.EMPTY

	this.HASH_PCE(pce, a_to)
	this.m_pieces[a_to] = pce

	for (index = 0; index < this.m_pceNum[pce]; index++) {
		if (this.m_pList[PCEINDEX(pce, index)] === a_from) {
			this.m_pList[PCEINDEX(pce, index)] = a_to
			break
		}
	}
}
/* MovePiece(a_from, a_to) */







 /**/
/*
NAME : GameBoard.MakeMove() - Executes the move in the board given the move number.

SYNOPSIS : MakeMove(a_move_number)
			a_move_number -> The 32 bit move number encapsulating all the information needed for a move.

DESCRIPTION 
			Executes the move in the board given the move number.
			Returns false if invalid move

RETURNS : true is legal move. False if the move is invalid.

AUTHOR : Srijan Prasad Joshi

DATE : 07/12/2020

*/
/**/
export function MakeMove (a_move_number){
	let from = FROMSQ(a_move_number)
	let to = TOSQ(a_move_number)
	let side = this.m_side

	this.m_history[this.m_hisPly].posKey = this.posKey

	if ((a_move_number & MFLAGEP) !== 0) {
		if (side === COLOURS.WHITE) {
			this.ClearPiece(to - 10)
		} else {
			this.ClearPiece(to + 10)
		}
	} else if ((a_move_number & MFLAGCA) !== 0) {
		// Check if the from square of castling is a king for extra guard
		if (this.m_pieces[from] === PIECES.wK || this.m_pieces[from] === PIECES.bK) {
			switch (to) {
				case SQUARES.C1:
					this.MovePiece(SQUARES.A1, SQUARES.D1);
					break
				case SQUARES.C8:
					this.MovePiece(SQUARES.A8, SQUARES.D8);
					break
				case SQUARES.G1:
					this.MovePiece(SQUARES.H1, SQUARES.F1);
					break
				case SQUARES.G8:
					this.MovePiece(SQUARES.H8, SQUARES.F8);
					break
				default:
					console.error("Castle Error")
					break
			}
		}
	}

	if (this.m_enPas !== SQUARES.NO_SQ) this.HASH_EP()
	this.HASH_CA()

	this.m_history[this.m_hisPly].move = a_move_number
	this.m_history[this.m_hisPly].m_fiftyMove = this.m_fiftyMove
	this.m_history[this.m_hisPly].enPas = this.m_enPas
	this.m_history[this.m_hisPly].castlePerm = this.m_castlePerm

	this.m_castlePerm &= CastlePerm[from]
	this.m_castlePerm &= CastlePerm[to]
	this.m_enPas = SQUARES.NO_SQ

	this.HASH_CA()

	let captured = CAPTURED(a_move_number)
	this.m_fiftyMove++

	if (captured !== PIECES.EMPTY) {
		this.ClearPiece(to)
		this.m_fiftyMove = 0
	}

	this.m_hisPly++
	this.m_ply++

	if (PiecePawn[this.m_pieces[from]] === true) {
		this.m_fiftyMove = 0
		if ((a_move_number & MFLAGPS) !== 0) {
			if (side === COLOURS.WHITE) {
				this.m_enPas = from + 10
			} else {
				this.m_enPas = from - 10
			}
			this.HASH_EP()
		}
	}

	this.MovePiece(from, to)

	let prPce = PROMOTED(a_move_number)

	if (prPce !== PIECES.EMPTY) {
		this.ClearPiece(to)
		this.AddPiece(to, prPce)
	}

	this.m_side ^= 1
	this.HASH_SIDE()

	if (this.SqAttacked(this.m_pList[PCEINDEX(Kings[side], 0)], this.m_side)) {
		this.TakeMove()
		return false
	}

	return true
}
/* MakeMove(a_move_number) */







 /**/
/*
NAME : GameBoard.TakeMove() - Goes back the game history by one step.

SYNOPSIS : TakeMove()

DESCRIPTION 
			Goes back the game history by one step.
			Takes back the latest move.
			Should not be called if in the starting position.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/12/2020

*/
/**/
export function TakeMove () {
	this.m_hisPly--;
	this.m_ply--;

	let move = this.m_history[this.m_hisPly].move;
	let from = FROMSQ(move);
	let to = TOSQ(move);

	if (this.m_enPas !== SQUARES.NO_SQ) this.HASH_EP();
	this.HASH_CA();

	this.m_castlePerm = this.m_history[this.m_hisPly].castlePerm;
	this.m_fiftyMove = this.m_history[this.m_hisPly].m_fiftyMove;
	this.m_enPas = this.m_history[this.m_hisPly].enPas;

	if (this.m_enPas !== SQUARES.NO_SQ) this.HASH_EP();
	this.HASH_CA();

	this.m_side ^= 1;
	this.HASH_SIDE();

	if ((MFLAGEP & move) !== 0) {
		if (this.m_side === COLOURS.WHITE) {
			this.AddPiece(to - 10, PIECES.bP);
		} else {
			this.AddPiece(to + 10, PIECES.wP);
		}
	} else if ((MFLAGCA & move) !== 0) {
		switch (to) {
			case SQUARES.C1:
				this.MovePiece(SQUARES.D1, SQUARES.A1);
				break;
			case SQUARES.C8:
				this.MovePiece(SQUARES.D8, SQUARES.A8);
				break;
			case SQUARES.G1:
				this.MovePiece(SQUARES.F1, SQUARES.H1);
				break;
			case SQUARES.G8:
				this.MovePiece(SQUARES.F8, SQUARES.H8);
				break;
			default:
				break;
		}
	}

	this.MovePiece(to, from);

	let captured = CAPTURED(move);
	if (captured !== PIECES.EMPTY) {
		this.AddPiece(to, captured);
	}

	if (PROMOTED(move) !== PIECES.EMPTY) {
		this.ClearPiece(from);
		this.AddPiece(
			from,
			PieceCol[PROMOTED(move)] === COLOURS.WHITE ? PIECES.wP : PIECES.bP
		);
	}
};
/* TakeMove() */
