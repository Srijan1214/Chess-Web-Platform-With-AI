import { PIECES, PCEINDEX, FROMSQ, TOSQ, MFLAGEP, COLOURS, MFLAGCA, SQUARES, CAPTURED, BOOL, MFLAGPS, PROMOTED,
	PieceVal, PieceCol, Kings, CastlePerm, PiecePawn} from "./defs.js"

export function ClearPiece (sq) {
	let pce = this.pieces[sq];
	let col = PieceCol[pce];
	let index;
	let t_pceNum = -1;

	this.HASH_PCE(pce, sq);

	this.pieces[sq] = PIECES.EMPTY;
	this.material[col] -= PieceVal[pce];

	for (index = 0; index < this.pceNum[pce]; index++) {
		if (this.pList[PCEINDEX(pce, index)] == sq) {
			t_pceNum = index;
			break;
		}
	}

	this.pceNum[pce]--;
	this.pList[PCEINDEX(pce, t_pceNum)] =
		this.pList[PCEINDEX(pce, this.pceNum[pce])];
}

export function AddPiece (sq, pce) {
	let col = PieceCol[pce];

	this.HASH_PCE(pce, sq);

	this.pieces[sq] = pce;
	this.material[col] += PieceVal[pce];
	this.pList[PCEINDEX(pce, this.pceNum[pce])] = sq;
	this.pceNum[pce]++;
};

export function MovePiece (from, to) {
	let index = 0
	let pce = this.pieces[from]

	this.HASH_PCE(pce, from)
	this.pieces[from] = PIECES.EMPTY

	this.HASH_PCE(pce, to)
	this.pieces[to] = pce

	for (index = 0; index < this.pceNum[pce]; index++) {
		if (this.pList[PCEINDEX(pce, index)] == from) {
			this.pList[PCEINDEX(pce, index)] = to
			break
		}
	}
}

export function MakeMove (move){
	let from = FROMSQ(move)
	let to = TOSQ(move)
	let side = this.side

	this.history[this.hisPly].posKey = this.posKey

	if ((move & MFLAGEP) != 0) {
		if (side == COLOURS.WHITE) {
			this.ClearPiece(to - 10)
		} else {
			this.ClearPiece(to + 10)
		}
	} else if ((move & MFLAGCA) != 0) {
		// Check if the from square of castling is a king for extra guard
		if (this.pieces[from] == PIECES.wK || this.pieces[from] == PIECES.bK) {
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

	if (this.enPas != SQUARES.NO_SQ) this.HASH_EP()
	this.HASH_CA()

	this.history[this.hisPly].move = move
	this.history[this.hisPly].fiftyMove = this.fiftyMove
	this.history[this.hisPly].enPas = this.enPas
	this.history[this.hisPly].castlePerm = this.castlePerm

	this.castlePerm &= CastlePerm[from]
	this.castlePerm &= CastlePerm[to]
	this.enPas = SQUARES.NO_SQ

	this.HASH_CA()

	let captured = CAPTURED(move)
	this.fiftyMove++

	if (captured != PIECES.EMPTY) {
		this.ClearPiece(to)
		this.fiftyMove = 0
	}

	this.hisPly++
	this.ply++

	if (PiecePawn[this.pieces[from]] == BOOL.TRUE) {
		this.fiftyMove = 0
		if ((move & MFLAGPS) != 0) {
			if (side == COLOURS.WHITE) {
				this.enPas = from + 10
			} else {
				this.enPas = from - 10
			}
			this.HASH_EP()
		}
	}

	this.MovePiece(from, to)

	let prPce = PROMOTED(move)

	if (prPce != PIECES.EMPTY) {
		this.ClearPiece(to)
		this.AddPiece(to, prPce)
	}

	this.side ^= 1
	this.HASH_SIDE()

	if (this.SqAttacked(this.pList[PCEINDEX(Kings[side], 0)], this.side)) {
		this.TakeMove()
		return BOOL.FALSE
	}

	return BOOL.TRUE
}

export function TakeMove () {
	this.hisPly--;
	this.ply--;

	let move = this.history[this.hisPly].move;
	let from = FROMSQ(move);
	let to = TOSQ(move);

	if (this.enPas != SQUARES.NO_SQ) this.HASH_EP();
	this.HASH_CA();

	this.castlePerm = this.history[this.hisPly].castlePerm;
	this.fiftyMove = this.history[this.hisPly].fiftyMove;
	this.enPas = this.history[this.hisPly].enPas;

	if (this.enPas != SQUARES.NO_SQ) this.HASH_EP();
	this.HASH_CA();

	this.side ^= 1;
	this.HASH_SIDE();

	if ((MFLAGEP & move) != 0) {
		if (this.side == COLOURS.WHITE) {
			this.AddPiece(to - 10, PIECES.bP);
		} else {
			this.AddPiece(to + 10, PIECES.wP);
		}
	} else if ((MFLAGCA & move) != 0) {
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
	if (captured != PIECES.EMPTY) {
		this.AddPiece(to, captured);
	}

	if (PROMOTED(move) != PIECES.EMPTY) {
		this.ClearPiece(from);
		this.AddPiece(
			from,
			PieceCol[PROMOTED(move)] == COLOURS.WHITE ? PIECES.wP : PIECES.bP
		);
	}
};