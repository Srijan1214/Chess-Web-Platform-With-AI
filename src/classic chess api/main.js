import { START_FEN, FILES, RANKS, SQUARES, BRD_SQ_NUM, FR2SQ, GENERATE_RAND_32, MAXGAMEMOVES, NOMOVE, PVENTRIES, 
	FilesBrd, PieceKeys, CastleKeys, Sq120ToSq64, Sq64ToSq120, RanksBrd, SideKey, InitMvvLva } from "./defs.js"
import GameBoard from "./board.js"
import AI from "../AI src files/search.js"

const GameBoardObj = new GameBoard()
const GameAI = new AI(GameBoardObj)


// $(function () {
init()
GameBoardObj.ParseFen(START_FEN)
GameBoardObj.PrintBoard()
GameBoardObj.GenerateMoves()
GameBoardObj.PrintMoveList()
console.log(GameBoardObj.moveList[ GameBoardObj.moveListStart[GameBoardObj.m_ply] ])
console.log( GameBoardObj.PrMove(GameBoardObj.moveList[  GameBoardObj.moveListStart[GameBoardObj.m_ply]]))
GameBoardObj.MakeMove(GameBoardObj.moveList[ GameBoardObj.moveListStart[GameBoardObj.m_ply] ])
GameBoardObj.PrintBoard()
GameBoardObj.GenerateMoves()
GameBoardObj.PrintMoveList()
GameAI.SearchPosition()
// })

document.getElementById("SetFen").addEventListener("click", function () {
	const fenstr = (document.getElementById("fenIn").value)
	GameBoardObj.ParseFen(fenstr)
	GameBoardObj.PrintBoard()
	GameBoardObj.GenerateCaptures()
	GameBoardObj.PrintMoveList()
	GameAI.SearchPosition()
	// SearchPosition()
	// PerftTest(3)
})

function init() {
	console.log("init() called")
	// InitFilesRanksBrd()
	// InitHashKeys()
	// InitSq120ToSq64()
	// InitBoardVars()
	// InitMvvLva()
}