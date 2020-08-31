import {PIECES, NOMOVE, BOOL, CAPTURED, FROMSQ, MAXDEPTH, BRD_SQ_NUM, TOSQ, RANKS, COLOURS, PCEINDEX, MFLAGPS, SQOFFBOARD, MFLAGEP, CASTLEBIT, SQUARES, MFLAGCA, 
	MVVLVASCORES,
	RanksBrd,
	DirNum, PceDir,LoopNonSlidePce, LoopNonSlideIndex,LoopSlidePce, LoopSlideIndex, PieceCol } from "./defs.js"

export function MoveExists (move) {
	this.GenerateMoves();

	let index;
	let moveFound = NOMOVE;
	for (
		index = this.moveListStart[this.ply];
		index < this.moveListStart[this.ply + 1];
		++index
	) {
		moveFound = this.moveList[index];
		if (this.MakeMove(moveFound) === BOOL.FALSE) {
			continue;
		}
		this.TakeMove();
		if (move === moveFound) {
			return BOOL.TRUE;
		}
	}
	return BOOL.FALSE;
};

export function MOVE (from, to, captured, promoted, flag) {
	return from | (to << 7) | (captured << 14) | (promoted << 20) | flag;
}

export function AddCaptureMove (move) {
	this.moveList[this.moveListStart[this.ply + 1]] = move;
	this.moveScores[this.moveListStart[this.ply + 1]] =
		MVVLVASCORES[CAPTURED(move) * 14 + this.m_pieces[FROMSQ(move)]] +
		1000000;
	this.moveListStart[this.ply + 1] += 1;
}

export function AddQuietMove (move) {
	this.moveList[this.moveListStart[this.ply + 1]] = move;
	this.moveScores[this.moveListStart[this.ply + 1]] = 0;

	if (move === this.searchKillers[this.ply]) {
		this.moveScores[
			this.moveListStart[this.ply + 1]
		] = 900000;
	} else if (move === this.searchKillers[this.ply + MAXDEPTH]) {
		this.moveScores[
			this.moveListStart[this.ply + 1]
		] = 800000;
	} else {
		this.moveScores[this.moveListStart[this.ply + 1]] =
			this.searchHistory[
				this.m_pieces[FROMSQ(move)] * BRD_SQ_NUM + TOSQ(move)
			];
	}

	this.moveListStart[this.ply + 1] += 1;
}

export function AddEnPassantMove (move) {
	this.moveList[this.moveListStart[this.ply + 1]] = move
	this.moveScores[this.moveListStart[this.ply + 1]] = 105 + 1000000
	this.moveListStart[this.ply + 1] += 1
}

export function AddWhitePawnCaptureMove (from, to, cap) {
	if (RanksBrd[from] === RANKS.RANK_7) {
		this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.wQ, 0))
		this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.wR, 0))
		this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.wB, 0))
		this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.wN, 0))
	}
	this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.EMPTY, 0))
}

export function AddBlackPawnCaptureMove (from, to, cap) {
	if (RanksBrd[from] === RANKS.RANK_2) {
		this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.bQ, 0))
		this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.bR, 0))
		this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.bB, 0))
		this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.bN, 0))
	}
	this.AddCaptureMove(this.MOVE(from, to, cap, PIECES.EMPTY, 0))
}

export function AddWhitePawnQuietMove (from, to) {
	if (RanksBrd[from] === RANKS.RANK_7) {
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.wQ, 0))
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.wR, 0))
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.wB, 0))
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.wN, 0))
	} else {
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0))
	}
}

export function AddBlackPawnQuietMove (from, to) {
	if (RanksBrd[from] === RANKS.RANK_2) {
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.bQ, 0))
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.bR, 0))
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.bB, 0))
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.bN, 0))
	} else {
		this.AddQuietMove(this.MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0))
	}
}

export function GenerateMoves () {
	this.moveListStart[this.ply + 1] =
		this.moveListStart[this.ply];

	let pceType;
	let pceNum;
	let sq;
	let pceIndex;
	let pce;
	let t_sq;
	let dir;
	let index;

	if (this.side === COLOURS.WHITE) {
		pceType = PIECES.wP;

		for (pceNum = 0; pceNum < this.pceNum[pceType]; pceNum++) {
			sq = this.pList[PCEINDEX(pceType, pceNum)];

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
				SQOFFBOARD(sq + 9) === BOOL.FALSE &&
				PieceCol[this.m_pieces[sq + 9]] === COLOURS.BLACK
			) {
				this.AddWhitePawnCaptureMove(sq, sq + 9, this.m_pieces[sq + 9]);
			}

			if (
				SQOFFBOARD(sq + 11) === BOOL.FALSE &&
				PieceCol[this.m_pieces[sq + 11]] === COLOURS.BLACK
			) {
				this.AddWhitePawnCaptureMove(sq, sq + 11, this.m_pieces[sq + 11]);
			}
			if (this.enPas !== SQUARES.NO_SQ) {
				if (sq + 9 === this.enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
				if (sq + 11 === this.enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
			}
		}

		if (this.castlePerm & CASTLEBIT.WKCA) {
			if (
				this.m_pieces[SQUARES.F1] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.G1] === PIECES.EMPTY
			) {
				if (
					this.SqAttacked(SQUARES.E1, COLOURS.BLACK) ===
						BOOL.FALSE &&
					this.SqAttacked(SQUARES.F1, COLOURS.BLACK) ===
						BOOL.FALSE &&
					this.SqAttacked(SQUARES.G1, COLOURS.BLACK) ===
						BOOL.FALSE
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

		if (this.castlePerm & CASTLEBIT.WQCA) {
			if (
				this.m_pieces[SQUARES.D1] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.C1] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.B1] === PIECES.EMPTY
			) {
				if (
					this.SqAttacked(SQUARES.D1, COLOURS.BLACK) ===
						BOOL.FALSE &&
					this.SqAttacked(SQUARES.E1, COLOURS.BLACK) ===
						BOOL.FALSE
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

		for (pceNum = 0; pceNum < this.pceNum[pceType]; pceNum++) {
			sq = this.pList[PCEINDEX(pceType, pceNum)];

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
				SQOFFBOARD(sq - 9) === BOOL.FALSE &&
				PieceCol[this.m_pieces[sq - 9]] === COLOURS.WHITE
			) {
				this.AddBlackPawnCaptureMove(sq, sq - 9, this.m_pieces[sq - 9]);
			}

			if (
				SQOFFBOARD(sq - 11) === BOOL.FALSE &&
				PieceCol[this.m_pieces[sq - 11]] === COLOURS.WHITE
			) {
				this.AddBlackPawnCaptureMove(sq, sq - 11, this.m_pieces[sq - 11]);
			}
			if (this.enPas !== SQUARES.NO_SQ) {
				if (sq - 9 === this.enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
				if (sq - 11 === this.enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
			}
		}

		if (this.castlePerm & CASTLEBIT.BKCA) {
			if (
				this.m_pieces[SQUARES.F8] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.G8] === PIECES.EMPTY
			) {
				if (
					this.SqAttacked(SQUARES.E8, COLOURS.WHITE) ===
						BOOL.FALSE &&
					this.SqAttacked(SQUARES.F8, COLOURS.WHITE) ===
						BOOL.FALSE &&
					this.SqAttacked(SQUARES.G8, COLOURS.WHITE) ===
						BOOL.FALSE
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

		if (this.castlePerm & CASTLEBIT.BQCA) {
			if (
				this.m_pieces[SQUARES.D8] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.C8] === PIECES.EMPTY &&
				this.m_pieces[SQUARES.B8] === PIECES.EMPTY
			) {
				if (
					this.SqAttacked(SQUARES.D8, COLOURS.WHITE) ===
						BOOL.FALSE &&
					this.SqAttacked(SQUARES.E8, COLOURS.WHITE) ===
						BOOL.FALSE
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
	pceIndex = LoopNonSlideIndex[this.side];
	pce = LoopNonSlidePce[pceIndex++];

	while (pce !== 0) {
		for (pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
			sq = this.pList[PCEINDEX(pce, pceNum)];

			for (index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				if (SQOFFBOARD(t_sq) === BOOL.TRUE) {
					continue;
				}

				if (this.m_pieces[t_sq] !== PIECES.EMPTY) {
					if (PieceCol[this.m_pieces[t_sq]] !== this.side) {
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

	pceIndex = LoopSlideIndex[this.side];
	pce = LoopSlidePce[pceIndex++];

	while (pce !== 0) {
		for (pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
			sq = this.pList[PCEINDEX(pce, pceNum)];

			for (index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				while (SQOFFBOARD(t_sq) === BOOL.FALSE) {
					if (this.m_pieces[t_sq] !== PIECES.EMPTY) {
						if (
							PieceCol[this.m_pieces[t_sq]] !== this.side
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

export function GenerateCaptures () {
	this.moveListStart[this.ply + 1] =
		this.moveListStart[this.ply];

	let pceType;
	let pceNum;
	let sq;
	let pceIndex;
	let pce;
	let t_sq;
	let dir;
	let index;

	if (this.side === COLOURS.WHITE) {
		pceType = PIECES.wP;

		for (pceNum = 0; pceNum < this.pceNum[pceType]; pceNum++) {
			sq = this.pList[PCEINDEX(pceType, pceNum)];

			if (
				SQOFFBOARD(sq + 9) === BOOL.FALSE &&
				PieceCol[this.m_pieces[sq + 9]] === COLOURS.BLACK
			) {
				this.AddWhitePawnCaptureMove(sq, sq + 9, this.m_pieces[sq + 9]);
			}

			if (
				SQOFFBOARD(sq + 11) === BOOL.FALSE &&
				PieceCol[this.m_pieces[sq + 11]] === COLOURS.BLACK
			) {
				this.AddWhitePawnCaptureMove(sq, sq + 11, this.m_pieces[sq + 11]);
			}
			if (this.enPas !== SQUARES.NO_SQ) {
				if (sq + 9 === this.enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq + 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
				if (sq + 11 === this.enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq + 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
			}
		}
	} else {
		pceType = PIECES.bP;

		for (pceNum = 0; pceNum < this.pceNum[pceType]; pceNum++) {
			sq = this.pList[PCEINDEX(pceType, pceNum)];

			if (
				SQOFFBOARD(sq - 9) === BOOL.FALSE &&
				PieceCol[this.m_pieces[sq - 9]] === COLOURS.WHITE
			) {
				this.AddBlackPawnCaptureMove(sq, sq - 9, this.m_pieces[sq - 9]);
			}

			if (
				SQOFFBOARD(sq - 11) === BOOL.FALSE &&
				PieceCol[this.m_pieces[sq - 11]] === COLOURS.WHITE
			) {
				this.AddBlackPawnCaptureMove(sq, sq - 11, this.m_pieces[sq - 11]);
			}
			if (this.enPas !== SQUARES.NO_SQ) {
				if (sq - 9 === this.enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq - 9, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
				if (sq - 11 === this.enPas) {
					this.AddEnPassantMove(
						this.MOVE(sq, sq - 11, PIECES.EMPTY, PIECES.EMPTY, MFLAGEP)
					);
				}
			}
		}
	}
	pceIndex = LoopNonSlideIndex[this.side];
	pce = LoopNonSlidePce[pceIndex++];

	while (pce !== 0) {
		for (pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
			sq = this.pList[PCEINDEX(pce, pceNum)];

			for (index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				if (SQOFFBOARD(t_sq) === BOOL.TRUE) {
					continue;
				}

				if (this.m_pieces[t_sq] !== PIECES.EMPTY) {
					if (PieceCol[this.m_pieces[t_sq]] !== this.side) {
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

	pceIndex = LoopSlideIndex[this.side];
	pce = LoopSlidePce[pceIndex++];

	while (pce !== 0) {
		for (pceNum = 0; pceNum < this.pceNum[pce]; pceNum++) {
			sq = this.pList[PCEINDEX(pce, pceNum)];

			for (index = 0; index < DirNum[pce]; index++) {
				dir = PceDir[pce][index];
				t_sq = sq + dir;

				while (SQOFFBOARD(t_sq) === BOOL.FALSE) {
					if (this.m_pieces[t_sq] !== PIECES.EMPTY) {
						if (
							PieceCol[this.m_pieces[t_sq]] !== this.side
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