import {
	BRD_SQ_NUM, PieceKeys, SideKey, CastleKeys, MAXGAMEMOVES, NOMOVE, PVENTRIES,
	COLOURS, PIECES, PCEINDEX, BOOL, SQ120, RANKS, FILES, FR2SQ, CASTLEBIT, SQUARES, PceChar, SideChar, RankChar, FileChar,
 KiDir, KnDir, RkDir, BiDir, PieceVal,PieceCol, PieceKnight, PieceKing, PieceRookQueen, PieceBishopQueen } from "./defs.js"

export function InitBoardVars () {
	let index = 0

	for(index = 0; index < MAXGAMEMOVES; index++) {
		this.m_history.push({
			move : NOMOVE,
			castlePerm : 0,
			enPas : 0,
			m_fiftyMove : 0,
			posKey : 0
		})
	}

	for (index = 0; index < PVENTRIES; index++) {
		this.m_PvTable.push({
			move: NOMOVE,
			posKey : 0
		})
	}
}

export function CheckBoard () {
	let t_pceNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	let t_material = [0, 0]
	let sq64, t_piece, t_pce_num, sq120 

	for (t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		for (t_pce_num = 0; t_pce_num < this.m_pceNum[t_piece]; ++t_pce_num) {
			sq120 = this.m_pList[PCEINDEX(t_piece, t_pce_num)]
			if (this.m_pieces[sq120] !== t_piece) {
				console.log('Error Pce Lists')
				return BOOL.FALSE
			}
		}
	}

	for (sq64 = 0; sq64 < 64; ++sq64) {
		sq120 = SQ120(sq64)
		t_piece = this.m_pieces[sq120]
		t_pceNum[t_piece]++
		t_material[PieceCol[t_piece]] += PieceVal[t_piece]
	}

	for (t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		if (t_pceNum[t_piece] !== this.m_pceNum[t_piece]) {
			console.log('Error t_pceNum')
			return BOOL.FALSE
		}
	}

	if (t_material[COLOURS.WHITE] !== this.m_material[COLOURS.WHITE] ||
		t_material[COLOURS.BLACK] !== this.m_material[COLOURS.BLACK]) {
		console.log('Error t_material')
		return BOOL.FALSE
	}

	if (this.m_side !== COLOURS.WHITE && this.m_side !== COLOURS.BLACK) {
		console.log('Error this.m_side')
		return BOOL.FALSE
	}

	if (this.GeneratePosKey() !== this.posKey) {
		console.log('Error this.posKey')
		return BOOL.FALSE
	}
	return BOOL.TRUE
}

export function PrintBoard () {
	let sq, file, rank, piece

	console.log("\nGame Board:\n")
	for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		let line = (RankChar[rank] + "  ")
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file, rank)
			piece = this.m_pieces[sq]
			line += (" " + PceChar[piece] + " ")
		}
		console.log(line)
	}

	console.log("")
	let line = "   "
	for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
		line += (' ' + FileChar[file] + ' ')
	}

	console.log(line)
	console.log("side:" + SideChar[this.m_side])
	console.log("enPas:" + this.m_enPas)
	line = ""

	if (this.m_castlePerm & CASTLEBIT.WKCA) line += 'K'
	if (this.m_castlePerm & CASTLEBIT.WQCA) line += 'Q'
	if (this.m_castlePerm & CASTLEBIT.BKCA) line += 'k'
	if (this.m_castlePerm & CASTLEBIT.BQCA) line += 'q'
	console.log("castle:" + line)
	console.log("key:" + this.posKey.toString(16))
}

export function GiveBoardArray () {
	const makeArray = function (a, b) {
		let arr = new Array(a)
		for (let index = 0; index < a; index++) arr[index] = new Array(b)
		return arr
	}

	const retArray = makeArray(8, 8)
	let sq, file, rank, piece

	for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file, rank)
			piece = this.m_pieces[sq]
			retArray[7 - rank][file] = PceChar[piece]
		}
	}

	return retArray
}

export function GeneratePosKey () {
	let sq = 0
	let finalKey = 0
	let piece = PIECES.EMPTY

	for (sq = 0; sq < BRD_SQ_NUM; sq++) {
		piece = this.m_pieces[sq]
		if (piece !== PIECES.EMPTY && piece !== SQUARES.OFFBOARD) {
			finalKey ^= PieceKeys[(piece * 120) + sq]
		}
	}

	if (this.m_side === COLOURS.WHITE) {
		finalKey ^= SideKey
	}

	if (this.m_enPas !== SQUARES.NO_SQ) {
		finalKey ^= PieceKeys[this.m_enPas]
	}

	finalKey ^= CastleKeys[this.m_castlePerm]

	return finalKey
}

export function PrintPieceLists () {
	let piece, pceNum

	for (piece = PIECES.wP; piece <= PIECES.bK; piece++) {
		for (pceNum = 0; pceNum < this.m_pceNum[piece]; pceNum++) {
			console.log('Piece ' + PceChar[piece] + ' on ' + this.PrSq(this.m_pList[PCEINDEX(piece, pceNum)]))
		}
	}
}

export function UpdateListsMaterial () {
	let piece, sq, index, colour

	for (index = 0; index < 14 * 120; ++index) {
		this.m_pList[index] = PIECES.EMPTY
	}

	for (index = 0; index < 2; ++index) {
		this.m_material[index] = 0
	}

	for (index = 0; index < 13; ++index) {
		this.m_pceNum[index] = 0
	}

	for (index = 0; index < 64; ++index) {
		sq = SQ120(index)
		piece = this.m_pieces[sq]
		if (piece !== PIECES.EMPTY) {
			colour = PieceCol[piece]

			this.m_material[colour] += PieceVal[piece]

			this.m_pList[PCEINDEX(piece, this.m_pceNum[piece])] = sq
			this.m_pceNum[piece]++
		}
	}

}

export function ResetBoard () {
	let index = 0

	for (index = 0; index < BRD_SQ_NUM; index++) {
		this.m_pieces[index] = SQUARES.OFFBOARD
	}

	for (index = 0; index < 64; index++) {
		this.m_pieces[SQ120(index)] = PIECES.EMPTY
	}

	this.m_side = COLOURS.BOTH
	this.m_enPas = SQUARES.NO_SQ
	this.m_fiftyMove = 0
	this.m_ply = 0
	this.m_hisPly = 0
	this.m_castlePerm = 0
	this.m_poskey = 0
	this.m_moveListStart[this.m_ply] = 0
}

export function ParseFen (fen) {
	this.ResetBoard()

	let rank = RANKS.RANK_8
	let file = FILES.FILE_A
	let piece = 0
	let count = 0
	let index = 0
	let sq120 = 0
	let fenCnt = 0

	while ((rank >= RANKS.RANK_1) && fenCnt < fen.length) {
		count = 1
		switch (fen[fenCnt]) {
			case 'p': piece = PIECES.bP; break
			case 'r': piece = PIECES.bR; break
			case 'n': piece = PIECES.bN; break
			case 'b': piece = PIECES.bB; break
			case 'k': piece = PIECES.bK; break
			case 'q': piece = PIECES.bQ; break
			case 'P': piece = PIECES.wP; break
			case 'R': piece = PIECES.wR; break
			case 'N': piece = PIECES.wN; break
			case 'B': piece = PIECES.wB; break
			case 'K': piece = PIECES.wK; break
			case 'Q': piece = PIECES.wQ; break

			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
				piece = PIECES.EMPTY
				count = fen[fenCnt].charCodeAt() - '0'.charCodeAt()
				break

			case '/':
			case ' ':
				rank--
				file = FILES.FILE_A
				fenCnt++
				continue
			default:
				console.log("FEN error")
				return
		}
		for (index = 0; index < count; index++) {
			sq120 = FR2SQ(file, rank)
			this.m_pieces[sq120] = piece
			file++
		}
		fenCnt++
	}

	this.m_side = (fen[fenCnt] === 'w') ? COLOURS.WHITE : COLOURS.BLACK
	fenCnt += 2

	for (index = 0; index < 4; index++) {
		if (fen[fenCnt] === ' ') {
			break
		}
		switch (fen[fenCnt]) {
			case 'K': this.m_castlePerm |= CASTLEBIT.WKCA; break
			case 'Q': this.m_castlePerm |= CASTLEBIT.WQCA; break
			case 'k': this.m_castlePerm |= CASTLEBIT.BKCA; break
			case 'q': this.m_castlePerm |= CASTLEBIT.BQCA; break
			default: break
		}
		fenCnt++
	}
	fenCnt++

	if (fen[fenCnt] !== '-') {
		file = fen[fenCnt].charCodeAt() - 'a'.charCodeAt()
		rank = fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt()
		console.log("fen[fenCnt]:" + fen[fenCnt] + " File:" + file + " Rank:" + rank)
		this.m_enPas = FR2SQ(file, rank)
	}

	this.posKey = this.GeneratePosKey()
	this.UpdateListsMaterial()
	// this.PrintSqAttacked()
	// PrintMoveList()
}

export function PrintSqAttacked () {

	let sq, file, rank, piece

	console.log("\nAttacked:\n")

	for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		let line = ((rank + 1) + "  ")
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file, rank)
			if (this.SqAttacked(sq, this.m_side) === BOOL.TRUE) piece = "X"
			else piece = "-"
			line += (" " + piece + " ")
		}
		console.log(line)
	}

	console.log("")

}

export function SqAttacked (sq, side)  {
	let pce;
	let index;

	if (side === COLOURS.WHITE) {
		if (
			this.m_pieces[sq - 11] === PIECES.wP ||
			this.m_pieces[sq - 9] === PIECES.wP
		) {
			return BOOL.TRUE;
		}
	} else {
		if (
			this.m_pieces[sq + 11] === PIECES.bP ||
			this.m_pieces[sq + 9] === PIECES.bP
		) {
			return BOOL.TRUE;
		}
	}

	for (index = 0; index < 8; index++) {
		pce = this.m_pieces[sq + KnDir[index]];
		if (
			pce !== SQUARES.OFFBOARD &&
			PieceCol[pce] === side &&
			PieceKnight[pce] === BOOL.TRUE
		) {
			return BOOL.TRUE;
		}
	}

	for (index = 0; index < 4; index++) {
		let dir = RkDir[index];
		let t_sq = sq + dir;
		let pce = this.m_pieces[t_sq];
		while (pce !== SQUARES.OFFBOARD) {
			if (pce !== PIECES.EMPTY) {
				if (PieceRookQueen[pce] === BOOL.TRUE && PieceCol[pce] === side) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = this.m_pieces[t_sq];
		}
	}

	for (index = 0; index < 4; index++) {
		let dir = BiDir[index];
		let t_sq = sq + dir;
		let pce = this.m_pieces[t_sq];
		while (pce !== SQUARES.OFFBOARD) {
			if (pce !== PIECES.EMPTY) {
				if (
					PieceBishopQueen[pce] === BOOL.TRUE &&
					PieceCol[pce] === side
				) {
					return BOOL.TRUE;
				}
				break;
			}
			t_sq += dir;
			pce = this.m_pieces[t_sq];
		}
	}

	for (index = 0; index < 8; index++) {
		pce = this.m_pieces[sq + KiDir[index]];
		if (
			pce !== SQUARES.OFFBOARD &&
			PieceCol[pce] === side &&
			PieceKing[pce] === BOOL.TRUE
		) {
			return BOOL.TRUE;
		}
	}

	return BOOL.FALSE;
};

export function HASH_PCE (pce, sq) {
	this.posKey ^= PieceKeys[(pce * 120) + sq]
}

export function HASH_CA () {
	this.posKey ^= CastleKeys[this.m_castlePerm]
}

export function HASH_SIDE () {
	this.posKey ^= SideKey
}

export function HASH_EP () {
	this.posKey ^= PieceKeys[this.m_enPas]
}