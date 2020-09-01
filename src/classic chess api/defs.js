// Generates random 32 bit numbers to facilitate in hashing keys.
// Hashing keys is necessary to know how many times the same position is repeated.
export const RAND_32 = () => {
	return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16)
		| (Math.floor((Math.random() * 255) + 1) << 8) | (Math.floor((Math.random() * 255) + 1))
}

// A piece-value dictionary to make code more descriptive than a number literal.
export const PIECES = {
	EMPTY: 0, wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6,
	bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12
}

// Number of squares in the large board.
export const BRD_SQ_NUM = 120

// A File-value dictionary to make code more descriptive than a number literal.
export const FILES = {
	FILE_A: 0, FILE_B: 1, FILE_C: 2, FILE_D: 3,
	FILE_E: 4, FILE_F: 5, FILE_G: 6, FILE_H: 7, FILE_NONE: 8
}

// A rank-value dictionary to make code more descriptive than a number literal.
export const RANKS = {
	RANK_1: 0, RANK_2: 1, RANK_3: 2, RANK_4: 3,
	RANK_5: 4, RANK_6: 5, RANK_7: 6, RANK_8: 7, RANK_NONE: 8
}

// A side color-value dictionary to make code more descriptive than a number literal.
export const COLOURS = { WHITE: 0, BLACK: 1, BOTH: 2, NONE: -1 }

// The castle_bit number keeps track of weather castling is possible and
// Performing bitwise AND with each number will tell if that particular castling is possible or not.
// e.g WKCA stands for White-King-Side-Castle
export const CASTLEBIT = { WKCA: 1, WQCA: 2, BKCA: 4, BQCA: 8 }

// The location-"120-size-array-index" dictionary that helps to be more descriptive of
// which square we are using in the 120-size-array.
export const SQUARES = {
	A1: 21, B1: 22, C1: 23, D1: 24, E1: 25, F1: 26, G1: 27, H1: 28,
	A8: 91, B8: 92, C8: 93, D8: 94, E8: 95, F8: 96, G8: 97, H8: 98,
	NO_SQ: 99, OFFBOARD: 100
}

export const BOOL = { FALSE: 0, TRUE: 1 }

// The max game moves. This is used because the game is obviously not going above this number
// and it helps make move search tree simpler and highly efficient.
export const MAXGAMEMOVES = 2048

// The max number of legal moves available in any position. 
// The number of available moves is surely not going above this.
// and it helps make move search tree simpler and highly efficient.
export const MAXPOSITIONMOVES = 256


export const MAXDEPTH = 64
export const INFINITE = 30000
export const MATE = 29000
export const PVENTRIES = 10000

// Gives which File number the 120 base index is on.
// Will Give SQUARES.OFFBOARD if not not inside actual board.
export const FilesBrd = new Array(BRD_SQ_NUM)

// Gives which Rank number the 120 base index is on.
// Will Give SQUARES.OFFBOARD if not not inside actual board.
export const RanksBrd = new Array(BRD_SQ_NUM)

export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
export const PceChar = ".PNBRQKpnbrqk"
export const SideChar = "wb-"
export const RankChar = "12345678"
export const FileChar = "abcdefgh"

// gives out the 120_Board index from file number and rank number
export const FR2SQ = (a_file_number, a_rank_number) => {
	return ((21 + (a_file_number)) + ((a_rank_number) * 10))
}

export const KnDir = [-8, -19, -21, -12, 8, 19, 21, 12]
export const RkDir = [-1, -10, 1, 10]
export const BiDir = [-9, -11, 11, 9]
export const KiDir = [-1, -10, 1, 10, -9, -11, 11, 9]
export const DirNum = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8]
export const PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir]
export const LoopNonSlidePce = [PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0]
export const LoopNonSlideIndex = [0, 3]
export const LoopSlidePce = [PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0]
export const LoopSlideIndex = [0, 4]


// Big pieces are any non-pawn piece. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceBig = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE]

// Major pieces are kings, queens and rooks. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceMaj = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE]

// Minor pieces are bishops and knights. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceMin = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE]

// The estimated piece value given to each piece. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000]

// The color of each piece. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceCol = [COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK]

// Tells if piece is a pawn. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PiecePawn = [BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE]

// Tells if piece is a Knight. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceKnight = [BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE]

// Tells if piece is a King. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceKing = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE]

// Tells if piece is a Queen. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceRookQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE]

// Tells if piece is a Bishop or Queen. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceBishopQueen = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE, BOOL.TRUE, BOOL.FALSE]

// Tells if piece is a sliding piece like rooks and bishops. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceSlides = [BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE, BOOL.FALSE, BOOL.FALSE, BOOL.TRUE, BOOL.TRUE, BOOL.TRUE, BOOL.FALSE]

export const PieceKeys = new Array(14 * 120)
export let SideKey = RAND_32()
export const CastleKeys = new Array(16)

export const Sq120ToSq64 = new Array(BRD_SQ_NUM)
export const Sq64ToSq120 = new Array(64)

// This function initializes the FilesBrd and RanksBrd arrays.
// Given a 120 base index, these arrays will then give the
// appropriate file and rank number.
function InitFilesRanksBrd() {
	let index = 0
	let file = FILES.FILE_A
	let rank = RANKS.RANK_1
	let sq = SQUARES.A1

	for (index = 0; index < BRD_SQ_NUM; index++) {
		FilesBrd[index] = SQUARES.OFFBOARD
		RanksBrd[index] = SQUARES.OFFBOARD
	}

	for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file, rank)
			FilesBrd[sq] = file
			RanksBrd[sq] = rank
		}
	}
}

function InitHashKeys(){
	let index = 0

	for(index = 0; index < 14 * 120; index++){
		PieceKeys[index] = RAND_32()
	}

	for(index = 0; index < 16; index++){
		CastleKeys[index] = RAND_32()
	}
}

function InitSq120ToSq64(){
	let index = 0
	let file = FILES.FILE_A
	let rank = RANKS.RANK_1
	let sq = SQUARES.A1
	let sq64 = 0

	for(index = 0; index < BRD_SQ_NUM; index++){
		Sq120ToSq64[index] = 65
	}

	for(index = 0; index < 64; index++){
		Sq120ToSq64[index] = 120
	}

	for (rank = RANKS.RANK_1; rank <= RANKS.RANK_8; rank++) {
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			sq = FR2SQ(file, rank)
			Sq64ToSq120[sq64] = sq
			Sq120ToSq64[sq] = sq64
			sq64++
		}
	}
}

InitFilesRanksBrd()
InitHashKeys()
InitSq120ToSq64()

export const Mirror64 = [
	56, 57, 58, 59, 60, 61, 62, 63,
	48, 49, 50, 51, 52, 53, 54, 55,
	40, 41, 42, 43, 44, 45, 46, 47,
	32, 33, 34, 35, 36, 37, 38, 39,
	24, 25, 26, 27, 28, 29, 30, 31,
	16, 17, 18, 19, 20, 21, 22, 23,
	8, 9, 10, 11, 12, 13, 14, 15,
	0, 1, 2, 3, 4, 5, 6, 7
]

export const SQ64 = (a_sq120) =>{
	return Sq120ToSq64[a_sq120]
}

export const SQ120 = (a_sq64) =>{
	return Sq64ToSq120[a_sq64]
}

// This function is always called with the pList array.
// Given the piece from PIECE and the serial number of that piece,
// this function called inside the pList will give what square on the 120_Board the piece is on.
// e.g. m_pList(PCEINDEX(2, 1)) will give the square of the second white knight.
export const PCEINDEX = (a_pce, a_pceNum) => {
	return (a_pce * 10 + a_pceNum)
}

export const MIRROR64 = (a_square_64) => {
	return Mirror64[a_square_64]
}

export const Kings = [PIECES.wK, PIECES.bK]

// bitwise & with appropriate 
// King/rook position will remove castle perm accordingly 
export const CastlePerm = [
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 13, 15, 15, 15, 12, 15, 15, 14, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 7, 15, 15, 15, 3, 15, 15, 11, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15,
	15, 15, 15, 15, 15, 15, 15, 15, 15, 15
]


export const FROMSQ = (a_move_number) => { return (a_move_number & 0x7F) }
export const TOSQ = (a_move_number) => { return ((a_move_number >> 7) & 0x7F) }
export const CAPTURED = (a_move_number) => { return ((a_move_number >> 14) & 0xF) }
export const PROMOTED = (a_move_number) => { return ((a_move_number >> 20) & 0xF) }

export const MFLAGEP = 0x40000
export const MFLAGPS = 0x80000
export const MFLAGCA = 0x1000000

export const MFLAGCAP = 0x7C000
export const MFLAGPROM = 0xF00000

export const NOMOVE = 0

export const SQOFFBOARD = (a_square_120) => {
	if (FilesBrd[a_square_120] === SQUARES.OFFBOARD) return BOOL.TRUE
	return BOOL.FALSE
}

export const MVVLVAVALUE = [0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600]
export const MVVLVASCORES = new Array(14 * 14)

export const InitMvvLva = () => {
	let Attacker;
	let Victim;

	for (Attacker = PIECES.wP; Attacker <= PIECES.bK; Attacker++) {
		for (Victim = PIECES.wP; Victim <= PIECES.bK; Victim++) {
			MVVLVASCORES[Victim * 14 + Attacker] =
				MVVLVAVALUE[Victim] + 6 - MVVLVAVALUE[Attacker] / 100;
		}
	}
};

InitMvvLva()
