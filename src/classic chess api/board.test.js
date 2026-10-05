import GameBoard from "./board.js"

describe("GameBoard.GiveFen", () => {
	test("serializes the start position", () => {
		const gb = new GameBoard()
		expect(gb.GiveFen()).toBe(
			"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
		)
	})

	test("tracks pawn moves, halfmove clock and en passant", () => {
		const gb = new GameBoard()
		gb.MovePieceUsingStandardLocations("e2", "e4")
		expect(gb.GiveFen()).toBe(
			"rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
		)
		gb.MovePieceUsingStandardLocations("e7", "e5")
		expect(gb.GiveFen()).toBe(
			"rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
		)
	})

	test("round trips castling rights and en-passant square", () => {
		const gb = new GameBoard()
		gb.ParseFen("r3k2r/8/8/3pP3/8/8/8/R3K2R w KQkq d6 0 1")
		expect(gb.GiveFen()).toBe("r3k2r/8/8/3pP3/8/8/8/R3K2R w KQkq d6 0 1")
	})
})
