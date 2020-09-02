/**/
/*
NAME : GENERATE_RAND_32 - Generates random 32 bit numbers to facilitate hashing keys.

SYNOPSIS : GENERATE_RAND_32()

DESCRIPTION 
			This function will generate a random 32 bit number.
			It will use generate 4 random 8 bit numbers and bit shift them
			accordingly to achieve the 32 bit.
			Hashing keys will be made using this function.
			Hashing keys are necessary to know how many times the same position is repeated.

RETURNS : A random 32 bit number.

AUTHOR : Srijan Prasad Joshi

DATE : 07/26/2020

*/
/**/
export const GENERATE_RAND_32 = () => {
	return (Math.floor((Math.random() * 255) + 1) << 23) | (Math.floor((Math.random() * 255) + 1) << 16)
		| (Math.floor((Math.random() * 255) + 1) << 8) | (Math.floor((Math.random() * 255) + 1))
}
/* const GENERATE_RAND_32() */

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

// The max game moves. This is used because the game is obviously not going above this number
// and it helps make move list simpler and highly efficient.
export const MAXGAMEMOVES = 2048

// The max number of legal moves available in any position. 
// The number of available moves is surely not going above this.
// and it helps make move list simpler and highly efficient.
export const MAXPOSITIONMOVES = 256

// The max depth that the AI will search to.
// This constant helps make search tree implementation simpler and efficient.
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

// The standard starting chess position fen string.
export const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

// The characters gives to each piece. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight. 
export const PceChar = ".PNBRQKpnbrqk"

// The characters gives to each side. The indexes correspond to the COLOURS dictionary.
export const SideChar = "wb-"
export const RankChar = "12345678"
export const FileChar = "abcdefgh"

// gives out the 120_Board index from file number and rank number
export const FR2SQ = (a_file_number, a_rank_number) => {
	return ((21 + (a_file_number)) + ((a_rank_number) * 10))
}

// knights can go 8 directions. Addition with the 120_Board index will give new square when moving to that direction.
export const KnDir = [-8, -19, -21, -12, 8, 19, 21, 12]

// Rooks can go 4 directions. Addition with the 120_Board index will give new square when moving to that direction.
export const RkDir = [-1, -10, 1, 10]

// Bishops can go 4 directions. Addition with the 120_Board index will give new square when moving to that direction.
export const BiDir = [-9, -11, 11, 9]

// Kings can go 8 directions. Addition with the 120_Board index will give new square when moving to that direction.
export const KiDir = [-1, -10, 1, 10, -9, -11, 11, 9]
export const DirNum = [0, 0, 8, 4, 4, 8, 8, 0, 8, 4, 4, 8, 8]
export const PceDir = [0, 0, KnDir, BiDir, RkDir, KiDir, KiDir, 0, KnDir, BiDir, RkDir, KiDir, KiDir]
export const LoopNonSlidePce = [PIECES.wN, PIECES.wK, 0, PIECES.bN, PIECES.bK, 0]
export const LoopNonSlideIndex = [0, 3]
export const LoopSlidePce = [PIECES.wB, PIECES.wR, PIECES.wQ, 0, PIECES.bB, PIECES.bR, PIECES.bQ, 0]
export const LoopSlideIndex = [0, 4]


// Big pieces are any non-pawn piece. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceBig = [false, false, true, true, true, true, true, false, true, true, true, true, true]

// Major pieces are kings, queens and rooks. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceMaj = [false, false, false, false, true, true, true, false, false, false, true, true, true]

// Minor pieces are bishops and knights. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceMin = [false, false, true, true, false, false, false, false, true, true, false, false, false]

// The estimated piece value given to each piece. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceVal = [0, 100, 325, 325, 550, 1000, 50000, 100, 325, 325, 550, 1000, 50000]

// The color of each piece. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceCol = [COLOURS.BOTH, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE, COLOURS.WHITE,
COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK, COLOURS.BLACK]

// Tells if piece is a pawn. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PiecePawn = [false, true, false, false, false, false, false, true, false, false, false, false, false]

// Tells if piece is a Knight. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceKnight = [false, false, true, false, false, false, false, false, true, false, false, false, false]

// Tells if piece is a King. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceKing = [false, false, false, false, false, false, true, false, false, false, false, false, true]

// Tells if piece is a Queen. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceRookQueen = [false, false, false, false, true, true, false, false, false, false, true, true, false]

// Tells if piece is a Bishop or Queen. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceBishopQueen = [false, false, false, true, false, true, false, false, false, true, false, true, false]

// Tells if piece is a sliding piece like rooks and bishops. The indexes correspond to the PIECES array. I.e index 1 is white pawn and 2 is white knight.
export const PieceSlides = [false, false, false, true, true, true, false, false, false, true, true, true, false]

// These keys facilitate in creating a hash that will be different for each position.
// Duplicate/ Repeated positions will have same hash
export const PieceKeys = new Array(14 * 120)

// This key facilitates in creating a hash that will be different for each position.
// Duplicate/ Repeated positions will have same hash
export let SideKey = GENERATE_RAND_32()

// These keys facilitate in creating a hash that will be different for each position.
// Duplicate/ Repeated positions will have same hash
export const CastleKeys = new Array(16)

// Array that gives the 64-size index from the 120-size index.
export const Sq120ToSq64 = new Array(BRD_SQ_NUM)

// Array that gives the 120-size index from the 64-size index.
export const Sq64ToSq120 = new Array(64)

/**/
/*
NAME : InitFilesRanksBrd - This function initializes the FilesBrd and RanksBrd arrays.

SYNOPSIS : InitFilesRanksBrd()

DESCRIPTION 
		This function initializes the FilesBrd and RanksBrd arrays.
		Given a 120 base index, these arrays will then give the
		appropriate file and rank number.

RETURNS : Nothing.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020

*/
/**/
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
/* InitFilesRanksBrd() */


/**/
/*
NAME : InitHashKeys - Initializes the PieceKeys and CastleKeys arrays with the random 32 bit number.

SYNOPSIS : InitHashKeys()

DESCRIPTION : Initializes the PieceKeys and CastleKeys arrays with random 32 bit numbers.

RETURNS : Nothing.

AUTHOR : Srijan Prasad Joshi

DATE : 07/26/2020
*/
/**/
function InitHashKeys(){
	let index = 0

	for(index = 0; index < 14 * 120; index++){
		PieceKeys[index] = GENERATE_RAND_32()
	}

	for(index = 0; index < 16; index++){
		CastleKeys[index] = GENERATE_RAND_32()
	}
}
/* InitHashKeys() */




/**/
/*
NAME : InitSq120ToSq64 - Initializes the Sq120ToSq64 and Sq64ToSq120 arrays to facilitate their usages.

SYNOPSIS : InitSq120ToSq64()

DESCRIPTION : Initializes the Sq120ToSq64 and Sq64ToSq120 arrays to facilitate their usages.

RETURNS : Nothing.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020
*/
/**/
// .
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
/* InitSq120ToSq64() */

// Necessary initializations for tbe respective arrays.
InitFilesRanksBrd()
InitHashKeys()
InitSq120ToSq64()

// Flips the 64_Board to view from black's perspective.
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



/**/
/*
NAME : SQ64() - Function that gives the 64-size index from the 120-size index.

SYNOPSIS : SQ64(a_sq120)
			a_sq120 -> The index of the 120_Board.

DESCRIPTION : Function that gives the 64-size index from the 120-size index.

RETURNS : The index (integer) of the 64-size array.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020
*/
/**/
export const SQ64 = (a_sq120) =>{
	return Sq120ToSq64[a_sq120]
}
/* SQ64(a_sq120) */


/**/
/*
NAME : SQ120() - Function that gives the 120-size index from the 64-size index.

SYNOPSIS : SQ120(a_sq64)
		a_sq64 -> The index of the 64_Board.

DESCRIPTION : Function that gives the 120-size index from the 64-size index..

RETURNS : The index (integer) of the 120-size array.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020
*/
/**/
export const SQ120 = (a_sq64) =>{
	return Sq64ToSq120[a_sq64]
}
/* SQ120(a_sq64) */


/**/
/*
NAME : PCEINDEX() - Creates the appropriate index for the piece_List from the piece type and its serial number.

SYNOPSIS : PCEINDEX(a_pce, a_pceNum)
		a_pce -> The piece number for a particular piece given by the PIECES dictionary.
		a_pceNum -> The serial number for that particular piece type on the board.

DESCRIPTION
	This function creates the appropriate index for the piece_List from the piece type and its serial number.
	This function is always called with the pList array.
	Given the piece from PIECE and the serial number of that piece,
	this function called inside the pList will give what square on the 120_Board the piece is on.
	e.g. m_pList(PCEINDEX(2, 1)) will give the square of the second white knight.

RETURNS : The calculated index for the piece_list array.

AUTHOR : Srijan Prasad Joshi

DATE : 07/26/2020
*/
/**/
export const PCEINDEX = (a_pce, a_pceNum) => {
	return (a_pce * 10 + a_pceNum)
}
/* PCEINDEX(a_pce, a_pceNum) */



/**/
/*
NAME : MIRROR64() - flips the square vertically.

SYNOPSIS : MIRROR64(a_square_64)
		a_square_64 ->The index of the 64_Board.

DESCRIPTION : Function that flips the 64_board to view from black's perspective.

RETURNS : The flipped square number inside the 64_size board.

AUTHOR : Srijan Prasad Joshi

DATE : 07/26/2020
*/
/**/
export const MIRROR64 = (a_square_64) => {
	return Mirror64[a_square_64]
}
/* MIRROR64 (a_square_64) */


// Gives the king piece number in the PIECES dictionary index by side.
// 0 is white and 1 is black
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



/**/
/*
NAME : FROMSQ() - Gets the square from which the move was played.

SYNOPSIS : FROMSQ(a_move_number)
		a_move_number -> The move number encapsulating through its BITS, all the information needed for a move to be unique.

DESCRIPTION : Gives the 120_Board from_square for a given move number through the bitwise AND operation.

RETURNS : The square number.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020
*/
/**/
export const FROMSQ = (a_move_number) => { return (a_move_number & 0x7F) }
/* FROMSQ (a_move_number) */



/**/
/*
NAME : TOSQ() - Gets the square to which the move was played.

SYNOPSIS : TOSQ(a_move_number)
		a_move_number -> The move number encapsulating through its BITS, all the information needed for a move to be unique.

DESCRIPTION : Gives the 120_Board to_square for a given move number through the bitwise AND operation.

RETURNS : The square number.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020
*/
/**/
export const TOSQ = (a_move_number) => { return ((a_move_number >> 7) & 0x7F) }
// TOSQ (a_move_number)




/**/
/*
NAME : CAPTURED() - Tells which piece was captured in a move.

SYNOPSIS : CAPTURED(a_move_number)
		a_move_number -> The move number encapsulating through its BITS, all the information needed for a move to be unique.

DESCRIPTION : Gets the captured piece type through the bitwise AND operation.

RETURNS : The captured piece type corresponding to the PIECES dictionary. Returns PIECES.EMPTY if no piece is captured in the move.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020
*/
/**/
export const CAPTURED = (a_move_number) => { return ((a_move_number >> 14) & 0xF) }
/* CAPTURED (a_move_number) */



/**/
/*
NAME : PROMOTED() - Tells which piece the pawn promotion of the move led to.

SYNOPSIS : PROMOTED(a_move_number)
		a_move_number -> The move number encapsulating through its BITS, all the information needed for a move to be unique.

DESCRIPTION : Gets the promoted piece type through the bitwise AND operation.

RETURNS : The promoted piece type corresponding to the PIECES dictionary. Returns PIECES.EMPTY if no promotion happened during the move.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020
*/
/**/
export const PROMOTED = (a_move_number) => { return ((a_move_number >> 20) & 0xF) }
/* PROMOTED (a_move_number) */




// Bitwise AND with move tells if move was a En-passant move or not.
export const MFLAGEP = 0x40000

// Bitwise AND with move tells if move was a pawn starting move or not.
export const MFLAGPS = 0x80000

// Bitwise AND with move tells if move was a castle move or not.
export const MFLAGCA = 0x1000000

// Bitwise AND with move tells if move was a capture move or not.
export const MFLAGCAP = 0x7C000

// Bitwise AND with move tells if move was a promotion move or not.
export const MFLAGPROM = 0xF00000

// Useful for telling if move is not a valid move.
export const NOMOVE = 0



/**/
/*
NAME : SQOFFBOARD() - Tells if the 120_Board index is outside the 64_Board.

SYNOPSIS : SQOFFBOARD(a_square_120)
		a_square_120 -> The index of the 120_Board.

DESCRIPTION : Tells if a_square_120 corresponds to a 64 square array.

RETURNS : True if inside. False if outside.

AUTHOR : Srijan Prasad Joshi

DATE : 07/25/2020
*/
/**/
export const SQOFFBOARD = (a_square_120) => {
	if (FilesBrd[a_square_120] === SQUARES.OFFBOARD) return true
	return false
}
/* SQOFFBOARD (a_square_120) */

// This is a score array for the victim. Indexed by PIECES.
// Queens and kings have the highest score as attacking them is more valuable than attacking pawns
// or empty squares.
export const MVVLVAVALUE = [0, 100, 200, 300, 400, 500, 600, 100, 200, 300, 400, 500, 600]

// Every combination of victim and attacker will have a score inside this array.
export const MVVLVASCORES = new Array(14 * 14)






/**/
/*
NAME : InitMvvLva() - Initialize the MVVLVASCORE and MVVLVASCORE arrays.

SYNOPSIS : InitMvvLva()

DESCRIPTION :
		Initialize MVVLVASCORES and MVVLVAVALUE in such a way that MVVLVASCORE
		is inversely proportional to the attacker and directly proportional
		the the victim. The "100" is just a good constant to work with.
		i.e pawn attacking a king is highest and king attacking a pawn is lowest.
		this makes sense because pawn attacking king has a higher probability of gaining an advantage
		than the opposite.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/28/2020
*/
/**/
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

// Call the initialize function.
InitMvvLva()
