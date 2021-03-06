/**/
/*

FILE DESCRIPTION:
			This file contains utility functions that cannot be placed into any specific group.
			All others files except of this files have related functions.
			However, these function are indeed important and very useful.

*/
/**/


import {
	BRD_SQ_NUM, PieceKeys, SideKey, CastleKeys, MAXGAMEMOVES, NOMOVE, PVENTRIES,
	COLOURS, PIECES, PCEINDEX, SQ120, RANKS, FILES, FR2SQ, CASTLEBIT, SQUARES, PceChar, SideChar, RankChar, FileChar,
 KiDir, KnDir, RkDir, BiDir, PieceVal,PieceCol, PieceKnight, PieceKing, PieceRookQueen, PieceBishopQueen } from "./defs.js"



 /**/
/*
NAME : GameBoard.InitBoardVars() - Initializes the m_history and m_PvTable array.

SYNOPSIS : InitBoardVars()

DESCRIPTION 
			Initializes the m_history and m_PvTable array.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/27/2020

*/
/**/
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
/* InitBoardVars() */




 /**/
/*
NAME : GameBoard.CheckBoard() - Checks if there were any errors during the initializations.

SYNOPSIS : CheckBoard()

DESCRIPTION 
			Checks if there were any errors during the initializations.
			Useful for seeing if there was any bug during implementation.

RETURNS : true if there is an error, false if everything is good.

AUTHOR : Srijan Prasad Joshi

DATE : 07/02/2020

*/
/**/
export function CheckBoard () {
	let t_pceNum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	let t_material = [0, 0]
	let sq64, t_piece, t_pce_num, sq120 

	for (t_piece = PIECES.wP; t_piece <= PIECES.bK; ++t_piece) {
		for (t_pce_num = 0; t_pce_num < this.m_pceNum[t_piece]; ++t_pce_num) {
			sq120 = this.m_pList[PCEINDEX(t_piece, t_pce_num)]
			if (this.m_pieces[sq120] !== t_piece) {
				console.log('Error Pce Lists')
				return false
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
			return false
		}
	}

	if (t_material[COLOURS.WHITE] !== this.m_material[COLOURS.WHITE] ||
		t_material[COLOURS.BLACK] !== this.m_material[COLOURS.BLACK]) {
		console.log('Error t_material')
		return false
	}

	if (this.m_side !== COLOURS.WHITE && this.m_side !== COLOURS.BLACK) {
		console.log('Error this.m_side')
		return false
	}

	if (this.GeneratePosKey() !== this.posKey) {
		console.log('Error this.posKey')
		return false
	}
	return true
}
/* CheckBoard() */





 /**/
/*
NAME : GameBoard.PrintBoard() - Console.logs the current position.

SYNOPSIS : PrintBoard()

DESCRIPTION 
			Console.logs the current position along with all
			information which makes the position unique.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/29/2020

*/
/**/
export function PrintBoard () {
	let square_120, file, rank, piece

	console.log("\nGame Board:\n")
	for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		let line = (RankChar[rank] + "  ")
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			square_120 = FR2SQ(file, rank)
			piece = this.m_pieces[square_120]
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
/* PrintBoard() */





 /**/
/*
NAME : GameBoard.GiveBoardArray() - Returns just the character array of the board.

SYNOPSIS : GiveBoardArray()

DESCRIPTION 
			Returns just the character array of the board.
			The character for a piece is given by the PceChar in defs.

RETURNS : A 8x8 character array representing the board.

AUTHOR : Srijan Prasad Joshi

DATE : 07/24/2020

*/
/**/
export function GiveBoardArray () {
	const makeArray = function (a, b) {
		let arr = new Array(a)
		for (let index = 0; index < a; index++) arr[index] = new Array(b)
		return arr
	}

	const retArray = makeArray(8, 8)
	let square_120, file, rank, piece

	for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			square_120 = FR2SQ(file, rank)
			piece = this.m_pieces[square_120]
			retArray[7 - rank][file] = PceChar[piece]
		}
	}

	return retArray
}
/* GiveBoardArray() */






 /**/
/*
NAME : GameBoard.GeneratePosKey() - Generates a unique hash for positions.

SYNOPSIS : GeneratePosKey()

DESCRIPTION 
			This function generate a unique hash for any given position.
			Duplicate positions will have the same hash.
			This is accomplished by performing the bitwise XOR against the PieceKeys for the pieces,
			PieceKeys for the en-Passant pawn, the CastleKeys, and the SideKey.

RETURNS : A hash number.

AUTHOR : Srijan Prasad Joshi

DATE : 07/06/2020

*/
/**/
export function GeneratePosKey () {
	let square_120 = 0
	let finalKey = 0
	let piece = PIECES.EMPTY

	for (square_120 = 0; square_120 < BRD_SQ_NUM; square_120++) {
		piece = this.m_pieces[square_120]
		if (piece !== PIECES.EMPTY && piece !== SQUARES.OFFBOARD) {
			finalKey ^= PieceKeys[(piece * 120) + square_120]
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
/* GeneratePosKey() */







 /**/
/*
NAME : GameBoard.PrintPieceLists() - Prints the Piece List Array to show which square has which piece.

SYNOPSIS : PrintPieceLists()

DESCRIPTION 
			Prints the Piece List Array to show which square has which piece.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/25/2020

*/
/**/
export function PrintPieceLists () {
	let piece, pceNum

	for (piece = PIECES.wP; piece <= PIECES.bK; piece++) {
		for (pceNum = 0; pceNum < this.m_pceNum[piece]; pceNum++) {
			console.log('Piece ' + PceChar[piece] + ' on ' + this.PrSq(this.m_pList[PCEINDEX(piece, pceNum)]))
		}
	}
}
/* PrintPieceLists() */







 /**/
/*
NAME : GameBoard.UpdateListsMaterial() - Assign all the pieces in the piece list to their respective squares.

SYNOPSIS : UpdateListsMaterial()

DESCRIPTION 
			Assign all the pieces in the piece list to their respective squares.
			Assign serial numbers with m_pceNum for each piece type.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/26/2020

*/
/**/
export function UpdateListsMaterial () {
	let piece, square_120, index, colour

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
		square_120 = SQ120(index)
		piece = this.m_pieces[square_120]
		if (piece !== PIECES.EMPTY) {
			colour = PieceCol[piece]

			this.m_material[colour] += PieceVal[piece]

			this.m_pList[PCEINDEX(piece, this.m_pceNum[piece])] = square_120
			this.m_pceNum[piece]++
		}
	}

}
/* UpdateListsMaterial() */







 /**/
/*
NAME : GameBoard.ResetBoard() - Resets the Board history and clears all pieces on board.

SYNOPSIS : ResetBoard()

DESCRIPTION 
			Resets the Board history and clears all pieces on board.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/28/2020

*/
/**/
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
/* ResetBoard() */







 /**/
/*
NAME : GameBoard.ParseFen() - Parses an FEN string and sets the board to the position.

SYNOPSIS : ParseFen()

DESCRIPTION 
			Parses an FEN string and sets the board to the position.
			
RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/06/2020

*/
/**/
export function ParseFen (a_fen) {
	this.ResetBoard()

	let rank = RANKS.RANK_8
	let file = FILES.FILE_A
	let piece = 0
	let count = 0
	let index = 0
	let sq120 = 0
	let fenCnt = 0

	while ((rank >= RANKS.RANK_1) && fenCnt < a_fen.length) {
		count = 1
		switch (a_fen[fenCnt]) {
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
				count = a_fen[fenCnt].charCodeAt() - '0'.charCodeAt()
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

	this.m_side = (a_fen[fenCnt] === 'w') ? COLOURS.WHITE : COLOURS.BLACK
	fenCnt += 2

	for (index = 0; index < 4; index++) {
		if (a_fen[fenCnt] === ' ') {
			break
		}
		switch (a_fen[fenCnt]) {
			case 'K': this.m_castlePerm |= CASTLEBIT.WKCA; break
			case 'Q': this.m_castlePerm |= CASTLEBIT.WQCA; break
			case 'k': this.m_castlePerm |= CASTLEBIT.BKCA; break
			case 'q': this.m_castlePerm |= CASTLEBIT.BQCA; break
			default: break
		}
		fenCnt++
	}
	fenCnt++

	if (a_fen[fenCnt] !== '-') {
		file = a_fen[fenCnt].charCodeAt() - 'a'.charCodeAt()
		rank = a_fen[fenCnt + 1].charCodeAt() - '1'.charCodeAt()
		console.log("a_fen[fenCnt]:" + a_fen[fenCnt] + " File:" + file + " Rank:" + rank)
		this.m_enPas = FR2SQ(file, rank)
	}

	this.posKey = this.GeneratePosKey()
	this.UpdateListsMaterial()
	// this.PrintSqAttacked()
	// PrintMoveList()
}
/* ParseFen() */







 /**/
/*
NAME : GameBoard.PrintSqAttacked() - Prints all of the squares that the current side to play is attacking.

SYNOPSIS : PrintSqAttacked()

DESCRIPTION 
			Prints all of the squares that the current side to play is attacking.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 07/01/2020

*/
/**/
export function PrintSqAttacked () {

	let square_120, file, rank, piece

	console.log("\nAttacked:\n")

	for (rank = RANKS.RANK_8; rank >= RANKS.RANK_1; rank--) {
		let line = ((rank + 1) + "  ")
		for (file = FILES.FILE_A; file <= FILES.FILE_H; file++) {
			square_120 = FR2SQ(file, rank)
			if (this.SqAttacked(square_120, this.m_side) === true) piece = "X"
			else piece = "-"
			line += (" " + piece + " ")
		}
		console.log(line)
	}

	console.log("")

}
/* PrintSqAttacked() */







 /**/
/*
NAME : GameBoard.SqAttacked() - Tells if the 120_Board square is attacked by the current side

SYNOPSIS : SqAttacked(a_square_120, a_side)
		a_square_120 -> The 120 index board square number.
		a_side -> Which side's move is it currently.

DESCRIPTION 
			Tells if the 120_Board square is attacked by the current side.

RETURNS : True if the current square is attacked by the side. False otherwise.

AUTHOR : Srijan Prasad Joshi

DATE : 06/27/2020

*/
/**/
export function SqAttacked (a_square_120, a_side)  {
	let piece_val;
	let index;

	if (a_side === COLOURS.WHITE) {
		if (
			this.m_pieces[a_square_120 - 11] === PIECES.wP ||
			this.m_pieces[a_square_120 - 9] === PIECES.wP
		) {
			return true;
		}
	} else {
		if (
			this.m_pieces[a_square_120 + 11] === PIECES.bP ||
			this.m_pieces[a_square_120 + 9] === PIECES.bP
		) {
			return true;
		}
	}

	for (index = 0; index < 8; index++) {
		piece_val = this.m_pieces[a_square_120 + KnDir[index]];
		if (
			piece_val !== SQUARES.OFFBOARD &&
			PieceCol[piece_val] === a_side &&
			PieceKnight[piece_val] === true
		) {
			return true;
		}
	}

	for (index = 0; index < 4; index++) {
		let dir = RkDir[index];
		let t_sq = a_square_120 + dir;
		let piece_val = this.m_pieces[t_sq];
		while (piece_val !== SQUARES.OFFBOARD) {
			if (piece_val !== PIECES.EMPTY) {
				if (PieceRookQueen[piece_val] === true && PieceCol[piece_val] === a_side) {
					return true;
				}
				break;
			}
			t_sq += dir;
			piece_val = this.m_pieces[t_sq];
		}
	}

	for (index = 0; index < 4; index++) {
		let dir = BiDir[index];
		let t_sq = a_square_120 + dir;
		let piece_val = this.m_pieces[t_sq];
		while (piece_val !== SQUARES.OFFBOARD) {
			if (piece_val !== PIECES.EMPTY) {
				if (
					PieceBishopQueen[piece_val] === true &&
					PieceCol[piece_val] === a_side
				) {
					return true;
				}
				break;
			}
			t_sq += dir;
			piece_val = this.m_pieces[t_sq];
		}
	}

	for (index = 0; index < 8; index++) {
		piece_val = this.m_pieces[a_square_120 + KiDir[index]];
		if (
			piece_val !== SQUARES.OFFBOARD &&
			PieceCol[piece_val] === a_side &&
			PieceKing[piece_val] === true
		) {
			return true;
		}
	}

	return false;
}
/* SqAttacked(a_square_120, a_side) */







 /**/
/*
NAME : GameBoard.HASH_PCE() - Hashes the position key with the piece-square combination key using the bitwise XOR.

SYNOPSIS : HASH_PCE(a_piece_value, a_square_120)
		a_piece_value : The piece type given by PIECES array in defs.
		a_square_120 -> The 120 index board square number.

DESCRIPTION 
			Hashes the position key with the piece-square combination key using the bitwise XOR.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/27/2020

*/
/**/
export function HASH_PCE (a_piece_value, a_square_120) {
	this.posKey ^= PieceKeys[(a_piece_value * 120) + a_square_120]
}
/* HASH_PCE(a_piece_value, a_square_120)*/







 /**/
/*
NAME : GameBoard.HASH_CA() - Hashes the position key with the appropriate castle key.

SYNOPSIS : HASH_CA()

DESCRIPTION 
			Hashes the position key with the appropriate castle key.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/27/2020

*/
/**/
export function HASH_CA () {
	this.posKey ^= CastleKeys[this.m_castlePerm]
}
/* HASH_CA()*/







 /**/
/*
NAME : GameBoard.HASH_SIDE() - Hashes the position key with the current side key.

SYNOPSIS : HASH_SIDE()

DESCRIPTION 
				Hashes the position key with the current side key.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/27/2020

*/
/**/
export function HASH_SIDE () {
	this.posKey ^= SideKey
}
/* HASH_SIDE()*/







 /**/
/*
NAME : GameBoard.HASH_EP() - Hashes the position key with the en-Passant piece.

SYNOPSIS : HASH_EP()

DESCRIPTION 
			Hashes the position key with the en-Passant piece.

RETURNS : NOTHING

AUTHOR : Srijan Prasad Joshi

DATE : 06/27/2020

*/
/**/
export function HASH_EP () {
	this.posKey ^= PieceKeys[this.m_enPas]
}
/* HASH_EP()*/
