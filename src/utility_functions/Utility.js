/**/
/* 
	 * FILE DESCRIPTION: 
	 * This file contains utility functions that would be useful in many places inside the project.
*/
/**/
import _ from "lodash"







 /**/
/*
NAME : GameBoard.Convert_RowCol_To_FileRank() - Converts row and column number to a standard chess location.

SYNOPSIS : Convert_RowCol_To_FileRank(a_row, a_column)
			a_row -> Row number indexed from 0-7.
			a_column -> Column number indexed from 0-7.

DESCRIPTION 
			Converts row and column number to a standard chess location string with file and rank.

RETURNS : The standard chess location string. e.g. 'a1'.

AUTHOR : Srijan Prasad Joshi

DATE : 08/06/2020

*/
/**/
export function Convert_RowCol_To_FileRank(a_row, a_column) {
	return String.fromCharCode(97 + a_column) + (8 - a_row)
}
/* Convert_RowCol_To_FileRank(a_row, a_column) */







 /**/
/*
NAME : GameBoard.Convert_FileRank_To_RowCol() - Converts a standard chess location to rows and column.

SYNOPSIS : Convert_FileRank_To_RowCol(a_location)
			a_location -> The standard chess location string. e.g. 'a1'.

DESCRIPTION 
			Converts a standard chess location to rows and column.

RETURNS : An object containing the row and column.

AUTHOR : Srijan Prasad Joshi

DATE : 08/06/2020

*/
/**/
export function Convert_FileRank_To_RowCol(a_location) {
	const column = a_location.charCodeAt(0) - 97
	const row = 8 - parseInt(a_location[1])
	return { row: row, column: column }
}
/* Convert_FileRank_To_RowCol(a_location) */







 /**/
/*
NAME : GameBoard.Get_White_King_Side_Castle_Array() - Returns an array after performing the white king side castle.

SYNOPSIS : Get_White_King_Side_Castle_Array(a_curPosition)
			a_curPosition -> The 8x8 position array consisting of piece values.

DESCRIPTION 
			Returns an array after performing the white king side castle.

RETURNS : A 8x8 array after the castle is performed.

AUTHOR : Srijan Prasad Joshi

DATE : 07/13/2020

*/
/**/
export function Get_White_King_Side_Castle_Array(a_curPosition) {
	const temp = _.cloneDeep(a_curPosition)
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
/* Get_White_King_Side_Castle_Array(a_curPosition) */







 /**/
/*
NAME : GameBoard.Get_White_Queen_Side_Castle_Array() - Returns an array after performing the white queen side castle.
 
SYNOPSIS : Get_White_Queen_Side_Castle_Array(a_curPosition)
			a_curPosition -> The 8x8 position array consisting of piece values.

DESCRIPTION 
			Returns an array after performing the white queen side castle.

RETURNS : A 8x8 array after the castle is performed.

AUTHOR : Srijan Prasad Joshi

DATE : 07/13/2020

*/
/**/
export function Get_White_Queen_Side_Castle_Array(a_curPosition) {
	const temp = _.cloneDeep(a_curPosition)
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
/* Get_White_Queen_Side_Castle_Array(a_curPosition) */







 /**/
/*
NAME : GameBoard.Get_Black_King_Side_Castle_Array() - Returns an array after performing the black king side castle.
 
SYNOPSIS : Get_Black_King_Side_Castle_Array(a_curPosition)
			a_curPosition -> The 8x8 position array consisting of piece values.

DESCRIPTION 
			Returns an array after performing the black king side castle.

RETURNS : A 8x8 array after the castle is performed.

AUTHOR : Srijan Prasad Joshi


*/
/**/
export function Get_Black_King_Side_Castle_Array(a_curPosition) {
	const temp = _.cloneDeep(a_curPosition)
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
/* Get_Black_King_Side_Castle_Array(a_curPosition) */







 /**/
/*
NAME : GameBoard.Get_Black_Queen_Side_Castle_Array() - Returns an array after performing the black queen side castle.

SYNOPSIS : Get_Black_Queen_Side_Castle_Array(a_curPosition)
			a_curPosition -> The 8x8 position array consisting of piece values.

DESCRIPTION 
			Returns an array after performing the black queen side castle.

RETURNS : A 8x8 array after the castle is performed.

AUTHOR : Srijan Prasad Joshi

DATE : 07/13/2020

*/
/**/
export function Get_Black_Queen_Side_Castle_Array(a_curPosition) {
	const temp = _.cloneDeep(a_curPosition)
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
/* Get_Black_Queen_Side_Castle_Array(a_curPosition) */

// converts [row, column] from white perspective to black's perspective.
// and vice versa






 /**/
/*
NAME : GameBoard.Get_Flipped_Row_Column() - Converts [row, column] from white perspective to Black's perspective. 

SYNOPSIS : Get_Flipped_Row_Column(a_row, a_column)
			a_row -> Row number indexed from 0-7.
			a_column -> Column number indexed from 0-7.

DESCRIPTION 
			Converts [row, column] from white perspective to Black's perspective
			and vice versa

RETURNS : An object containing the row and column.

AUTHOR : Srijan Prasad Joshi

DATE : 08/16/2020

*/
/**/
export function Get_Flipped_Row_Column(a_row, a_column) {
	a_row = 7 - a_row
	a_column = 7 - a_column
	return { row: a_row, column: a_column }
}
/* Get_Flipped_Row_Column(a_row, a_column) */







 /**/
/*
NAME : GameBoard.Get_Flipped_Square() - Converts square(e.g "a3") from white perspective to Black's perspective (e.g "h6")

SYNOPSIS : Get_Flipped_Square(a_location)
			a_location -> the location in standard string format to be flipped.

DESCRIPTION 
			Converts square(e.g "a3") from white perspective to Black's perspective (e.g "h6")
			and vice versa

RETURNS : The standard chess location string. e.g. 'a1'.

AUTHOR : Srijan Prasad Joshi

DATE : 08/16/2020

*/
/**/
export function Get_Flipped_Square(a_location) {
	let file = a_location[0]
	file = file.charCodeAt(0) - 97
	// file = file + 7 - 2 * file
	file = 7 - file
	file = String.fromCharCode(file + 97)
	let rank = a_location[1]
	rank = parseInt(rank) - 1
	rank = 7 - rank + 1
	return file + rank
}
/* Get_Flipped_Square(a_location) */
