/**/
/*

FILE DESCRIPTION: 
	This file contains the main class for the chess game api.
	All the functions are defined outside the file.
	I use function binding to make the code more structured and clean.

*/
/**/



import * as movegen from "./movegen.js"
import * as makeMove from "./makeMove.js"
import * as Outside_function from "./board_utility_functions.js"
import * as debug_io from "./io.js"
import { GetMoveStatus, MovePieceUsingStandardLocations } from "./moveParser.js"
import * as gameEndCheckers from "./gameEndCheckerFunctions.js"
import * as boardInterfaceFunctions from "./board_interface_functions"
import { BRD_SQ_NUM, COLOURS, MAXDEPTH,MAXPOSITIONMOVES, START_FEN } from "./defs.js"



/**/
/*
NAME : GameBoard - The class that acts as the chess game api.

DESCRIPTION 
			The class that acts as the chess game api.RETURNS : A random 32 bit number.
			By instantiating this class, one can pay a full chess games.
			This class facilitates everything needed for a chess game by providing functions like
			print_the_board, or checking if one can move a piece from a certain square to a certain square.

AUTHOR : Srijan Prasad Joshi

DATE : 07/28/2020

*/
/**/
export default class GameBoard {
	m_pieces = new Array(BRD_SQ_NUM)
	m_side = COLOURS.WHITE
	m_fiftyMove = 0
	m_hisPly = 0 // count of every halfmove played
	m_history = []
	m_ply = 0 // count of halfmove played in the search tree
	m_enPas = 0
	m_castlePerm = 0
	m_material = new Array(2) // Cummulative piece weights for each side
	m_pceNum = new Array(13) // Tells how many of each piece we have
	m_pList = new Array(14 * 10)
	m_poskey = 0

	m_moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES)
	m_moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES)
	m_moveListStart = new Array(MAXDEPTH)
	m_PvTable = []
	m_PvArray = new Array(MAXDEPTH)
	m_searchHistory = new Array(14 * BRD_SQ_NUM)
	m_searchKillers = new Array(3 * MAXDEPTH)

	/**/
	/*
	NAME : GameBoard.constructor() - Constructor for the GameBoard class.

	SYNOPSIS : constructor()

	DESCRIPTION 
				This function will bind all the necessary imported functions to the class.
				Makes necessary initializations for the class.

	RETURNS : NOTHING

	AUTHOR : Srijan Prasad Joshi

	DATE : 08/01/2020

	*/
	/**/
	constructor() {
		// Define Basic Member function
		this.InitBoardVars = Outside_function.InitBoardVars.bind(this)
		this.ParseFen = Outside_function.ParseFen.bind(this)
		this.CheckBoard = Outside_function.CheckBoard.bind(this)
		this.GeneratePosKey = Outside_function.GeneratePosKey.bind(this)
		this.HASH_CA = Outside_function.HASH_CA.bind(this)
		this.HASH_EP = Outside_function.HASH_EP.bind(this)
		this.HASH_PCE = Outside_function.HASH_PCE.bind(this)
		this.HASH_SIDE = Outside_function.HASH_SIDE.bind(this)
		this.PrintBoard = Outside_function.PrintBoard.bind(this)
		this.PrintPieceLists = Outside_function.PrintPieceLists.bind(this)
		this.PrintSqAttacked = Outside_function.PrintSqAttacked.bind(this)
		this.ResetBoard = Outside_function.ResetBoard.bind(this)
		this.SqAttacked = Outside_function.SqAttacked.bind(this)
		this.UpdateListsMaterial = Outside_function.UpdateListsMaterial.bind(this)
		this.GiveBoardArray = Outside_function.GiveBoardArray.bind(this)

		// MakeMove functions
		this.AddPiece = makeMove.AddPiece.bind(this)
		this.MakeMove = makeMove.MakeMove.bind(this)
		this.MovePiece = makeMove.MovePiece.bind(this)
		this.ClearPiece = makeMove.ClearPiece.bind(this)
		this.TakeMove = makeMove.TakeMove.bind(this)

		//MoveGen functions
		this.AddBlackPawnCaptureMove = movegen.AddBlackPawnCaptureMove.bind(this)
		this.AddBlackPawnQuietMove = movegen.AddBlackPawnQuietMove.bind(this)
		this.AddCaptureMove = movegen.AddCaptureMove.bind(this)
		this.AddEnPassantMove = movegen.AddEnPassantMove.bind(this)
		this.AddQuietMove = movegen.AddQuietMove.bind(this)
		this.AddWhitePawnCaptureMove = movegen.AddWhitePawnCaptureMove.bind(this)
		this.AddWhitePawnQuietMove = movegen.AddWhitePawnQuietMove.bind(this)
		this.GenerateCaptures = movegen.GenerateCaptures.bind(this)
		this.GenerateMoves = movegen.GenerateMoves.bind(this)
		this.MOVE = movegen.MOVE.bind(this)
		this.MoveExists = movegen.MoveExists.bind(this)

		// MoveParser function
		this.GetMoveStatus = GetMoveStatus.bind(this)
		this.MovePieceUsingStandardLocations = MovePieceUsingStandardLocations.bind(this)

		// GameEndChecker Functions
		this.CheckIfDrawDueToMaterial = gameEndCheckers.CheckIfDrawDueToMaterial.bind(this)
		this.ThreeFoldRep = gameEndCheckers.ThreeFoldRep.bind(this)
		this.CheckIfDrawnPosition = gameEndCheckers.CheckIfDrawnPosition.bind(this)
		this.GetWhichSideWon = gameEndCheckers.GetWhichSideWon.bind(this)
		this.CheckIfDrawDueToStalemate = gameEndCheckers.CheckIfDrawDueToStalemate.bind(this)

		// Board Interface Functions
		this.Set_Board_To_Start_Position = boardInterfaceFunctions.Set_Board_To_Start_Position.bind(this)
		this.TakeBack_Move = boardInterfaceFunctions.TakeBack_Move.bind(this)

		// Helpful IO functions
		this.PrMove = debug_io.PrMove.bind(this)
		this.PrSq = debug_io.PrSq.bind(this)
		this.PrintMoveList = debug_io.PrintMoveList.bind(this)

		this.InitBoardVars()
		this.ParseFen(START_FEN)
	}
}