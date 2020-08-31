import * as movegen from "./movegen.js"
import * as makeMove from "./makeMove.js"
import * as Outside_function from "./board_utility_functions.js"
import * as debug_io from "./io.js"
import { get_move_status, move_piece } from "./moveParser.js"
import * as gameEndCheckers from "./gameEndCheckerFunctions.js"
import * as boardInterfaceFunctions from "./board_interface_functions"
import { BRD_SQ_NUM, COLOURS, MAXDEPTH,MAXPOSITIONMOVES, START_FEN } from "./defs.js"

export default class GameBoard {
	m_pieces = new Array(BRD_SQ_NUM)
	side = COLOURS.WHITE
	fiftyMove = 0
	hisPly = 0 // count of every halfmove played
	history = []
	ply = 0 // count of halfmove played in the search tree
	enPas = 0
	castlePerm = 0
	material = new Array(2) // Cummulative piece weights for each side
	pceNum = new Array(13) // Tells how many of each piece we have
	pList = new Array(14 * 10)
	poskey = 0

	moveList = new Array(MAXDEPTH * MAXPOSITIONMOVES)
	moveScores = new Array(MAXDEPTH * MAXPOSITIONMOVES)
	moveListStart = new Array(MAXDEPTH)
	PvTable = []
	PvArray = new Array(MAXDEPTH)
	searchHistory = new Array(14 * BRD_SQ_NUM)
	searchKillers = new Array(3 * MAXDEPTH)

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
		this.get_move_status = get_move_status.bind(this)
		this.move_piece = move_piece.bind(this)

		// GameEndChecker Functions
		this.check_if_draw_due_to_material = gameEndCheckers.check_if_draw_due_to_material.bind(this)
		this.ThreeFoldRep = gameEndCheckers.ThreeFoldRep.bind(this)
		this.check_if_drawn_position = gameEndCheckers.check_if_drawn_position.bind(this)
		this.get_which_side_won = gameEndCheckers.get_which_side_won.bind(this)
		this.check_if_draw_due_to_stalemate = gameEndCheckers.check_if_draw_due_to_stalemate.bind(this)

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