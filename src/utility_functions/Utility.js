export function convert_rowCol_to_fileRank(row, column){
	return (String.fromCharCode(97 + column) + (8 - row))
}

export function convert_fileRank_to_rowCol(location){
	let column = location.charCodeAt(0) - 97;
	let row = parseInt(location[1]) - 1
	return { row: row, column: column }
}