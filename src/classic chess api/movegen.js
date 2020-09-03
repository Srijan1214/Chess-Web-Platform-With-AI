/**/
/* 
	 * FILE DESCRIPTION: 
	 *	This file has functions necessary for generating legal moves.
	 *	This also contains functions that facilitate performing moves on Board.
*/
/**/
import {PIECES, NOMOVE, CAPTURED, FROMSQ, MAXDEPTH, BRD_SQ_NUM, TOSQ, RANKS, COLOURS, PCEINDEX, MFLAGPS, SQOFFBOARD, MFLAGEP, CASTLEBIT, SQUARES, MFLAGCA, 
	MVVLVASCORES,
	RanksBrd,
	DirNum, PceDir,LoopNonSlidePce, LoopNonSlideIndex,LoopSlidePce, LoopSlideIndex, PieceCol } from "./defs.js"







 /**/
/*
NAME : GameBoard.MoveExists() - Checks if the move is a legal move.

SYNOPSIS : MoveExists(a_move_number)
			a_move_number: The 32 bit number encapsulating all the information needed for a move.

DESCRIPTION 
			This function checks the move is legal in the position or not.
			This also considers checks which the MakeMove function does not.

RETURNS : true if the move is legal. False if not.

AUTHOR : Srijan Prasad Joshi

DATE : 07/14/2020

*/
/**/
export function MoveExists (a_move_number) {
	this.GenerateMoves();

	let index;
	let moveFound = NOMOVE;
	for (
		index = this.m_moveListStart[this.m_ply];
		index < this.m_moveListStart[this.m_ply + 1];
		++index
	) {
		moveFound = this.m_moveList[index];
		if (this.MakeMove(moveFound) === false) {
			continue;
		}
		this.TakeMove();
		if (a_move_number === moveFound) {
			return true;
		}
	}
	return false;
};
/* MoveExists(a_move_number) */







 /**/
/*
NAME : GameBoard.MOVE() - Gives the 32 bit move number that encapsulates the move.

SYNOPSIS : MOVE(a_from, a_to, a_captured, a_promoted, a_flag)
			a_from -> The 120 Board index from which the move is played.
			a_to -> The 120 Board index to which the move is played.
			a_captured -> The piece type number given by PIECES which was captured.
			a_promoted -> The piece type number given by PIECES to which the pawn promoting led to.
			a_flag -> The castle flag for the move.

DESCRIPTION 
			Gives out the appropriate move number given all the information 
			which makes a move unique in chess.
			This is accomplished by bit shifting and using the bitwise OR.

RETURNS : a 32 bit move number encapsulating all the information for a chess move.

AUTHOR : Srijan Prasad Joshi

DATE : 06/17/2020

*/
/**/
export function MOVE (a_from, a_to, a_captured, a_promoted, a_flag) {
	return a_from | (a_to << 7) | (a_captured << 14) | (a_promoted << 20) | a_flag;
}
/* MOVE(a_from, a_to, a_captured, a_promoted, a_flag) */







 /**/
/*
NAME : GameBoard.AddCaptureMove() - Adds a capture move in the moveList for the current position.

SYNOPSIS : AddCaptureMove(a_move_number)
			a_move_number: The 32 bit number encapsulating all the information needed for a move.

DESCRIPTION 
			Adds a capture move in the moveList for the current position.
			Also reflects necessary stuff in the m_moveScores and m_moveListStart arrays.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/17/2020

*/
/**/
export function AddCaptureMove (a_move_number) {
	this.m_moveList[this.m_moveListStart[this.m_ply + 1]] = a_move_number;
	this.m_moveScores[this.m_moveListStart[this.m_ply + 1]] =
		MVVLVASCORES[CAPTURED(a_move_number) * 14 + this.m_pieces[FROMSQ(a_move_number)]] +
		1000000;
	this.m_moveListStart[this.m_ply + 1] += 1;
}
/* AddCaptureMove(a_move_number) */










 /**/
/*
NAME : GameBoard.AddQuietMove() - Adds a non-capture move in the moveList for the current position.

SYNOPSIS : AddQuietMove(a_move_number)
			a_move_number: The 32 bit number encapsulating all the information needed for a move.

DESCRIPTION 
			Adds a non-capture move in the moveList for the current position.
			Also reflects necessary stuff in the m_moveScores and m_moveListStart arrays.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

*/
/**/
export function AddQuietMove (a_move_number) {
	this.m_moveList[this.m_moveListStart[this.m_ply + 1]] = a_move_number;
	this.m_moveScores[this.m_moveListStart[this.m_ply + 1]] = 0;

	if (a_move_number === this.m_searchKillers[this.m_ply]) {
		this.m_moveScores[
			this.m_moveListStart[this.m_ply + 1]
		] = 900000;
	} else if (a_move_number === this.m_searchKillers[this.m_ply + MAXDEPTH]) {
		this.m_moveScores[
			this.m_moveListStart[this.m_ply + 1]
		] = 800000;
	} else {
		this.m_moveScores[this.m_moveListStart[this.m_ply + 1]] =
			this.m_searchHistory[
				this.m_pieces[FROMSQ(a_move_number)] * BRD_SQ_NUM + TOSQ(a_move_number)
			];
	}

	this.m_moveListStart[this.m_ply + 1] += 1;
}
/* AddQuietMove (a_move_number) */







 /**/
/*
NAME : GameBoard.AddEnPassantMove() - Adds a capture move in the move list for the current postion.

SYNOPSIS : AddEnPassantMove(a_move_number)
			a_move_number: The 32 bit number encapsulating all the information needed for a move.

DESCRIPTION 
			Adds a capture move in the move list for the current postion.
			Also reflects necessary stuff in the m_moveScores and m_moveListStart arrays.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/17/2020

*/
/**/
export function AddEnPassantMove (a_move_number) {
	this.m_moveList[this.m_moveListStart[this.m_ply + 1]] = a_move_number
	this.m_moveScores[this.m_moveListStart[this.m_ply + 1]] = 105 + 1000000
	this.m_moveListStart[this.m_ply + 1] += 1
}
/* AddEnPassantMove (a_move_number) */








 /**/
/*
NAME : GameBoard.AddWhitePawnCaptureMove() - Reflects a white pawn capturing a piece in the necessary places.

SYNOPSIS : AddWhitePawnCaptureMove(a_from, a_to, a_cap)
			a_from: The 120 board index from which the move is played.
			a_to: The 120 board index to which the move is played.
			a_cap: The captured piece type given by the PIECES dictionary.

DESCRIPTION 
			Adds a white pawn capturing a piece move in the move list for the current postion.
			Also reflects necessary stuff in the m_moveScores and m_moveListStart arrays.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/17/2020

*/
/**/
export function AddWhitePawnCaptureMove (a_from, a_to, a_cap) {
	if (RanksBrd[a_from] === RANKS.RANK_7) {
		this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.wQ, 0))
		this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.wR, 0))
		this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.wB, 0))
		this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.wN, 0))
	}
	this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.EMPTY, 0))
}
/* AddWhitePawnCaptureMove(a_from, a_to, a_cap) */






 /**/
/*
NAME : GameBoard.AddBlackPawnCaptureMove() - Reflects a black pawn capturing a piece in the necessary places.

SYNOPSIS : AddBlackPawnCaptureMove(a_from, a_to, a_cap)
			a_from: The 120 board index from which the move is played.
			a_to: The 120 board index to which the move is played.
			a_cap: The captured piece type given by the PIECES dictionary.

DESCRIPTION 
			Adds a black pawn capturing a piece move in the move list for the current postion.
			Also reflects necessary stuff in the m_moveScores and m_moveListStart arrays.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/17/2020

*/
/**/

export function AddBlackPawnCaptureMove (a_from, a_to, a_cap) {
	if (RanksBrd[a_from] === RANKS.RANK_2) {
		this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.bQ, 0))
		this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.bR, 0))
		this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.bB, 0))
		this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.bN, 0))
	}
	this.AddCaptureMove(this.MOVE(a_from, a_to, a_cap, PIECES.EMPTY, 0))
}
/* AddBlackPawnCaptureMove(a_from, a_to) */






 /**/
/*
NAME : GameBoard.AddWhitePawnQuietMove() - Reflects a white pawn non-capturing move in the necessary places.

SYNOPSIS : AddWhitePawnQuietMove(a_from, a_to, a_cap)
			a_from: The 120 board index from which the move is played.
			a_to: The 120 board index to which the move is played.
			a_cap: The captured piece type given by the PIECES dictionary.

DESCRIPTION 
			Adds a white pawn non-capturing a piece move in the move list for the current postion.
			Also reflects necessary stuff in the m_moveScores and m_moveListStart arrays.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/17/2020

*/
/**/
export function AddWhitePawnQuietMove (a_from, a_to) {
	if (RanksBrd[a_from] === RANKS.RANK_7) {
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.wQ, 0))
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.wR, 0))
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.wB, 0))
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.wN, 0))
	} else {
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.EMPTY, 0))
	}
}
/* AddWhitePawnQuietMove(a_from, a_to) */






 /**/
/*
NAME : GameBoard.AddBlackPawnQuietMove() - Reflects a black pawn non-capturing move in the necessary places.

SYNOPSIS : AddBlackPawnQuietMove(a_from, a_to, a_cap)
			a_from: The 120 board index from which the move is played.
			a_to: The 120 board index to which the move is played.
			a_cap: The captured piece type given by the PIECES dictionary.

DESCRIPTION 
			Adds a black pawn non-capturing a piece move in the move list for the current postion.
			Also reflects necessary stuff in the m_moveScores and m_moveListStart arrays.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/17/2020

*/
/**/
export function AddBlackPawnQuietMove (a_from, a_to) {
	if (RanksBrd[a_from] === RANKS.RANK_2) {
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.bQ, 0))
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.bR, 0))
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.bB, 0))
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.bN, 0))
	} else {
		this.AddQuietMove(this.MOVE(a_from, a_to, PIECES.EMPTY, PIECES.EMPTY, 0))
	}
}
/* AddBlackPawnQuietMove(a_from, a_to) */







 /**/
/*
NAME : GameBoard.GenerateMoves() - Fills the move list with legal moves in the given position.

SYNOPSIS : GenerateMoves()

DESCRIPTION 
			Fills the move list with legal moves in the given position.
			Does not take checks into account.
			Very important function that is slow.
			This function basically dictates the rules for the game.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/19/2020

*/
/**/
export function GenerateMoves () {
	this.m_moveListStart[this.m_ply + 1] =
		this.m_moveListStart[this.m_ply];

	let pceType;
	let pceNum;
	let sq;
	let pceIndex;
	let pce;
	let t_sq;
	let dir;
	let index;

	if (this.m_side === COLOURS.WHITE) {
		pceType = PIECES.wP;

		for (pceNum = 0; pceNum < this.m_pceNum[pceType]; pceNum++) {
			sq = this.m_pList[PCEINDEX(pceType, pceNum)];

			if (this.m_pieces[sq + 10] === PIECES.EMPTY) {
				this.AddWhitePawnQuietMove(sq, sq + 10);
				if (
					RanksBrd[sq] === RANKS.RANK_2 &&
					this.m_pieces[sq + 20] === PIECES.EMPTY
				) {
					this.AddQuietMove(
						this.MOVE(sq, sq + 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS)
					);
				}
			}

			if (
				SQOFFBOARD(sq + 9) === false &&
				PieceCol[this.m_pieces[sq + 9]] === COLOURS.BLACK
			) {
				this.AddWhitePawnCaptureMove(sq, sq + 9, this.m_pieces[sq + 9]);
			}

			if (
				SQOFFBOARD(sq + 11) === false &&
				PieceCol[this.m_pieces[sq + 11]] === COLOURS.BLACK
			) {
				this.AddWhitePawnCaptureMove(sq, sq + 11, this.m_pieces[sq + 11]);
			}
			if (this.m_enPas !== SQUARES.NO_SQ) {
				if (sq + 9 === this.m_enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
				if (sq + 11 === this.m_enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
			}
		}

		if (this.m_castlePerm & CASTLEBIT.WKCA) {
			if (
				this.m_pieces[SQUARES.F1] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.G1] === PIECES.EMPTY
			) {
				if (
					this.SqAttacked(SQUARES.E1, COLOURS.BLACK) ===
						false &&
					this.SqAttacked(SQUARES.F1, COLOURS.BLACK) ===
						false &&
					this.SqAttacked(SQUARES.G1, COLOURS.BLACK) ===
						false
				) {
					this.AddQuietMove(
						this.MOVE(
							SQUARES.E1,
							SQUARES.G1,
							PIECES.EMPTY,
							PIECES.EMPTY,
							MFLAGCA
						)
					);
				}
			}
		}

		if (this.m_castlePerm & CASTLEBIT.WQCA) {
			if (
				this.m_pieces[SQUARES.D1] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.C1] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.B1] === PIECES.EMPTY
			) {
				if (
					this.SqAttacked(SQUARES.D1, COLOURS.BLACK) ===
						false &&
					this.SqAttacked(SQUARES.E1, COLOURS.BLACK) ===
						false
				) {
					this.AddQuietMove(
						this.MOVE(
							SQUARES.E1,
							SQUARES.C1,
							PIECES.EMPTY,
							PIECES.EMPTY,
							MFLAGCA
						)
					);
				}
			}
		}
	} else {
		pceType = PIECES.bP;

		for (pceNum = 0; pceNum < this.m_pceNum[pceType]; pceNum++) {
			sq = this.m_pList[PCEINDEX(pceType, pceNum)];

			if (this.m_pieces[sq - 10] === PIECES.EMPTY) {
				// Add Pawn Move
				this.AddBlackPawnQuietMove(sq, sq - 10);
				if (
					RanksBrd[sq] === RANKS.RANK_7 &&
					this.m_pieces[sq - 20] === PIECES.EMPTY
				) {
					this.AddQuietMove(
						this.MOVE(sq, sq - 20, PIECES.EMPTY, PIECES.EMPTY, MFLAGPS)
					);
				}
			}

			if (
				SQOFFBOARD(sq - 9) === false &&
				PieceCol[this.m_pieces[sq - 9]] === COLOURS.WHITE
			) {
				this.AddBlackPawnCaptureMove(sq, sq - 9, this.m_pieces[sq - 9]);
			}

			if (
				SQOFFBOARD(sq - 11) === false &&
				PieceCol[this.m_pieces[sq - 11]] === COLOURS.WHITE
			) {
				this.AddBlackPawnCaptureMove(sq, sq - 11, this.m_pieces[sq - 11]);
			}
			if (this.m_enPas !== SQUARES.NO_SQ) {
				if (sq - 9 === this.m_enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
				if (sq - 11 === this.m_enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
			}
		}

		if (this.m_castlePerm & CASTLEBIT.BKCA) {
			if (
				this.m_pieces[SQUARES.F8] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.G8] === PIECES.EMPTY
			) {
				if (
					this.SqAttacked(SQUARES.E8, COLOURS.WHITE) ===
						false &&
					this.SqAttacked(SQUARES.F8, COLOURS.WHITE) ===
						false &&
					this.SqAttacked(SQUARES.G8, COLOURS.WHITE) ===
						false
				) {
					this.AddQuietMove(
						this.MOVE(
							SQUARES.E8,
							SQUARES.G8,
							PIECES.EMPTY,
							PIECES.EMPTY,
							MFLAGCA
						)
					);
				}
			}
		}

		if (this.m_castlePerm & CASTLEBIT.BQCA) {
			if (
				this.m_pieces[SQUARES.D8] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.C8] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.B8] === PIECES.EMPTY
			) {
				if (
					this.SqAttacked(SQUARES.D8, COLOURS.WHITE) ===
						false &&
					this.SqAttacked(SQUARES.E8, COLOURS.WHITE) ===
						false
				) {
					this.AddQuietMove(
						this.MOVE(
							SQUARES.E8,
							SQUARES.C8,
							PIECES.EMPTY,
							PIECES.EMPTY,
							MFLAGCA
						)
					);
				}
			}
		}
	}
	pceIndex = LoopNonSlideIndex[this.m_side];
	pce = LoopNonSlidePce[pceIndex++];

	while (pce !== 0) {
		for (pceNum = 0; pceNum < this.m_pceNum[pce]; pceNum++) {
			sq = this.m_pList[PCEINDEX(pce, pceNum)];

			for (index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				if (SQOFFBOARD(t_sq) === true) {
					continue;
				}

				if (this.m_pieces[t_sq] !== PIECES.EMPTY) {
					if (PieceCol[this.m_pieces[t_sq]] !== this.m_side) {
						this.AddCaptureMove(
							this.MOVE(
								sq,
								t_sq,
								this.m_pieces[t_sq],
								PIECES.EMPTY,
								0
							)
						);
					}
				} else {
					this.AddQuietMove(this.MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
				}
			}
		}
		pce = LoopNonSlidePce[pceIndex++];
	}

	pceIndex = LoopSlideIndex[this.m_side];
	pce = LoopSlidePce[pceIndex++];

	while (pce !== 0) {
		for (pceNum = 0; pceNum < this.m_pceNum[pce]; pceNum++) {
			sq = this.m_pList[PCEINDEX(pce, pceNum)];

			for (index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				while (SQOFFBOARD(t_sq) === false) {
					if (this.m_pieces[t_sq] !== PIECES.EMPTY) {
						if (
							PieceCol[this.m_pieces[t_sq]] !== this.m_side
						) {
							this.AddCaptureMove(
								this.MOVE(
									sq,
									t_sq,
									this.m_pieces[t_sq],
									PIECES.EMPTY,
									0
								)
							);
						}
						break;
					}
					this.AddQuietMove(this.MOVE(sq, t_sq, PIECES.EMPTY, PIECES.EMPTY, 0));
					t_sq += dir;
				}
			}
		}
		pce = LoopSlidePce[pceIndex++];
	}
}
/* GenerateMoves() */







 /**/
/*
NAME : GameBoard.GenerateCaptures() - Fills the moveList with only the capture moves in the given position.

SYNOPSIS : GenerateCaptures()

DESCRIPTION 
			Fills the moveList with only the capture moves in the given position.
			This function is only used by the AI to help in calculation as capture moves are most likely to
			be of higher importance.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/10/2020

*/
/**/
export function GenerateCaptures () {
	this.m_moveListStart[this.m_ply + 1] =
		this.m_moveListStart[this.m_ply];

	let pceType;
	let pceNum;
	let sq;
	let pceIndex;
	let pce;
	let t_sq;
	let dir;
	let index;

	if (this.m_side === COLOURS.WHITE) {
		pceType = PIECES.wP;

		for (pceNum = 0; pceNum < this.m_pceNum[pceType]; pceNum++) {
			sq = this.m_pList[PCEINDEX(pceType, pceNum)];

			if (
				SQOFFBOARD(sq + 9) === false &&
				PieceCol[this.m_pieces[sq + 9]] === COLOURS.BLACK
			) {
				this.AddWhitePawnCaptureMove(sq, sq + 9, this.m_pieces[sq + 9]);
			}

			if (
				SQOFFBOARD(sq + 11) === false &&
				PieceCol[this.m_pieces[sq + 11]] === COLOURS.BLACK
			) {
				this.AddWhitePawnCaptureMove(sq, sq + 11, this.m_pieces[sq + 11]);
			}
			if (this.m_enPas !== SQUARES.NO_SQ) {
				if (sq + 9 === this.m_enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
				if (sq + 11 === this.m_enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
			}
		}
	} else {
		pceType = PIECES.bP;

		for (pceNum = 0; pceNum < this.m_pceNum[pceType]; pceNum++) {
			sq = this.m_pList[PCEINDEX(pceType, pceNum)];

			if (
				SQOFFBOARD(sq - 9) === false &&
				PieceCol[this.m_pieces[sq - 9]] === COLOURS.WHITE
			) {
				this.AddBlackPawnCaptureMove(sq, sq - 9, this.m_pieces[sq - 9]);
			}

			if (
				SQOFFBOARD(sq - 11) === false &&
				PieceCol[this.m_pieces[sq - 11]] === COLOURS.WHITE
			) {
				this.AddBlackPawnCaptureMove(sq, sq - 11, this.m_pieces[sq - 11]);
			}
			if (this.m_enPas !== SQUARES.NO_SQ) {
				if (sq - 9 === this.m_enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
				if (sq - 11 === this.m_enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
			}
		}
	}
	pceIndex = LoopNonSlideIndex[this.m_side];
	pce = LoopNonSlidePce[pceIndex++];

	while (pce !== 0) {
		for (pceNum = 0; pceNum < this.m_pceNum[pce]; pceNum++) {
			sq = this.m_pList[PCEINDEX(pce, pceNum)];

			for (index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				if (SQOFFBOARD(t_sq) === true) {
					continue;
				}

				if (this.m_pieces[t_sq] !== PIECES.EMPTY) {
					if (PieceCol[this.m_pieces[t_sq]] !== this.m_side) {
						this.AddCaptureMove(
							this.MOVE(
								sq,
								t_sq,
								this.m_pieces[t_sq],
								PIECES.EMPTY,
								0
							)
						);
					}
				}
			}
		}
		pce = LoopNonSlidePce[pceIndex++];
	}

	pceIndex = LoopSlideIndex[this.m_side];
	pce = LoopSlidePce[pceIndex++];

	while (pce !== 0) {
		for (pceNum = 0; pceNum < this.m_pceNum[pce]; pceNum++) {
			sq = this.m_pList[PCEINDEX(pce, pceNum)];

			for (index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				while (SQOFFBOARD(t_sq) === false) {
					if (this.m_pieces[t_sq] !== PIECES.EMPTY) {
						if (
							PieceCol[this.m_pieces[t_sq]] !== this.m_side
						) {
							this.AddCaptureMove(
								this.MOVE(
									sq,
									t_sq,
									this.m_pieces[t_sq],
									PIECES.EMPTY,
									0
								)
							);
						}
						break;
					}
					t_sq += dir;
				}
			}
		}
		pce = LoopSlidePce[pceIndex++];
	}
}
/* GenerateCaptures() */
