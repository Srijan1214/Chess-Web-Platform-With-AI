import _ from "lodash"

export function convert_rowCol_to_fileRank(row, column) {
	return String.fromCharCode(97 + column) + (8 - row)
}

export function convert_fileRank_to_rowCol(location) {
	const column = location.charCodeAt(0) - 97
	const row = 8 - parseInt(location[1])
	return { row: row, column: column }
}

export function get_white_king_side_castle_array(curPosition) {
	const temp = _.cloneDeep(curPosition)
	const { row: r1, column: c1 } = convert_fileRank_to_rowCol("e1")
	const { row: r2, column: c2 } = convert_fileRank_to_rowCol("f1")
	const { row: r3, column: c3 } = convert_fileRank_to_rowCol("g1")
	const { row: r4, column: c4 } = convert_fileRank_to_rowCol("h1")
	temp[r1][c1] = 0
	temp[r2][c2] = 0
	temp[r3][c3] = 0
	temp[r4][c4] = 0
	temp[r3][c3] = 4
	temp[r2][c2] = 5
	return temp
}

export function get_white_queen_side_castle_array(curPosition) {
	const temp = _.cloneDeep(curPosition)
	const { row: r1, column: c1 } = convert_fileRank_to_rowCol("e1")
	const { row: r2, column: c2 } = convert_fileRank_to_rowCol("d1")
	const { row: r3, column: c3 } = convert_fileRank_to_rowCol("c1")
	const { row: r4, column: c4 } = convert_fileRank_to_rowCol("b1")
	const { row: r5, column: c5 } = convert_fileRank_to_rowCol("a1")
	temp[r1][c1] = 0
	temp[r2][c2] = 0
	temp[r3][c3] = 0
	temp[r4][c4] = 0
	temp[r5][c5] = 0
	temp[r3][c3] = 4
	temp[r2][c2] = 5
	return temp
}

export function get_black_king_side_castle_array(curPosition) {
	const temp = _.cloneDeep(curPosition)
	const { row: r1, column: c1 } = convert_fileRank_to_rowCol("e8")
	const { row: r2, column: c2 } = convert_fileRank_to_rowCol("f8")
	const { row: r3, column: c3 } = convert_fileRank_to_rowCol("g8")
	const { row: r4, column: c4 } = convert_fileRank_to_rowCol("h8")
	temp[r1][c1] = 0
	temp[r2][c2] = 0
	temp[r3][c3] = 0
	temp[r4][c4] = 0
	temp[r3][c3] = 14
	temp[r2][c2] = 15
	return temp
}

export function get_black_queen_side_castle_array(curPosition) {
	const temp = _.cloneDeep(curPosition)
	const { row: r1, column: c1 } = convert_fileRank_to_rowCol("e8")
	const { row: r2, column: c2 } = convert_fileRank_to_rowCol("d8")
	const { row: r3, column: c3 } = convert_fileRank_to_rowCol("c8")
	const { row: r4, column: c4 } = convert_fileRank_to_rowCol("b8")
	const { row: r5, column: c5 } = convert_fileRank_to_rowCol("a8")
	temp[r1][c1] = 0
	temp[r2][c2] = 0
	temp[r3][c3] = 0
	temp[r4][c4] = 0
	temp[r5][c5] = 0
	temp[r3][c3] = 14
	temp[r2][c2] = 15
	return temp
}

// converts [row, column] from white perspective to black's perspective.
// and vice versa
export function get_flipped_row_column(r, c) {
	r = 7 - r
	c = 7 - c
	return { r: r, c: c }
}

// converts square(e.g "a3") from white perspective to black's perspective (e.g "h6").
// and vice versa
export function get_flipped_square(location) {
	let file = location[0]
	file = file.charCodeAt(0) - 97
	// file = file + 7 - 2 * file
	file = 7 - file
	file = String.fromCharCode(file + 97)
	let rank = location[1]
	rank = parseInt(rank) - 1
	rank = 7 - rank + 1
	return file + rank
}