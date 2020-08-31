import _ from "lodash"

export function Convert_RowCol_To_FileRank(a_row, column) {
	return String.fromCharCode(97 + column) + (8 - a_row)
}

export function Convert_FileRank_To_RowCol(location) {
	const column = location.charCodeAt(0) - 97
	const row = 8 - parseInt(location[1])
	return { row: row, column: column }
}

export function Get_White_King_Side_Castle_Array(curPosition) {
	const temp = _.cloneDeep(curPosition)
	const { row: r1, column: c1 } = Convert_FileRank_To_RowCol("e1")
	const { row: r2, column: c2 } = Convert_FileRank_To_RowCol("f1")
	const { row: r3, column: c3 } = Convert_FileRank_To_RowCol("g1")
	const { row: r4, column: c4 } = Convert_FileRank_To_RowCol("h1")
	temp[r1][c1] = 0
	temp[r2][c2] = 0
	temp[r3][c3] = 0
	temp[r4][c4] = 0
	temp[r3][c3] = 4
	temp[r2][c2] = 5
	return temp
}

export function Get_White_Queen_Side_Castle_Array(curPosition) {
	const temp = _.cloneDeep(curPosition)
	const { row: r1, column: c1 } = Convert_FileRank_To_RowCol("e1")
	const { row: r2, column: c2 } = Convert_FileRank_To_RowCol("d1")
	const { row: r3, column: c3 } = Convert_FileRank_To_RowCol("c1")
	const { row: r4, column: c4 } = Convert_FileRank_To_RowCol("b1")
	const { row: r5, column: c5 } = Convert_FileRank_To_RowCol("a1")
	temp[r1][c1] = 0
	temp[r2][c2] = 0
	temp[r3][c3] = 0
	temp[r4][c4] = 0
	temp[r5][c5] = 0
	temp[r3][c3] = 4
	temp[r2][c2] = 5
	return temp
}

export function Get_Black_King_Side_Castle_Array(curPosition) {
	const temp = _.cloneDeep(curPosition)
	const { row: r1, column: c1 } = Convert_FileRank_To_RowCol("e8")
	const { row: r2, column: c2 } = Convert_FileRank_To_RowCol("f8")
	const { row: r3, column: c3 } = Convert_FileRank_To_RowCol("g8")
	const { row: r4, column: c4 } = Convert_FileRank_To_RowCol("h8")
	temp[r1][c1] = 0
	temp[r2][c2] = 0
	temp[r3][c3] = 0
	temp[r4][c4] = 0
	temp[r3][c3] = 14
	temp[r2][c2] = 15
	return temp
}

export function Get_Black_Queen_Side_Castle_Array(curPosition) {
	const temp = _.cloneDeep(curPosition)
	const { row: r1, column: c1 } = Convert_FileRank_To_RowCol("e8")
	const { row: r2, column: c2 } = Convert_FileRank_To_RowCol("d8")
	const { row: r3, column: c3 } = Convert_FileRank_To_RowCol("c8")
	const { row: r4, column: c4 } = Convert_FileRank_To_RowCol("b8")
	const { row: r5, column: c5 } = Convert_FileRank_To_RowCol("a8")
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
export function Get_Flipped_Row_Column(a_row, column) {
	a_row = 7 - a_row
	column = 7 - column
	return { row: a_row, column: column }
}

// converts square(e.g "a3") from white perspective to black's perspective (e.g "h6").
// and vice versa
export function Get_Flipped_Square(location) {
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