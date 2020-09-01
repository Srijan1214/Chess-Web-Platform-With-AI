import _ from "lodash"
import {
	Convert_RowCol_To_FileRank
} from "../../utility_functions/Utility.js"
import { Get_Flipped_Row_Column } from "../../utility_functions/Utility.js"

export function Outside_MouseClickHandler(a_event) {
	if (this) {
		if (a_event.button === 0) {
			if(this.state.should_block_user_input){
				return
			}
			let rect = a_event.currentTarget.getBoundingClientRect();
			let x = a_event.clientX - rect.left;
			let y = a_event.clientY - rect.top;

			let canvas_width = a_event.currentTarget.width
			let canvas_height = a_event.currentTarget.height

			x = x * canvas_width / this.state.canvas_width
			y = y * canvas_height / this.state.canvas_height

			let row = parseInt((y / (canvas_height - 1)) * 8)
			let column = parseInt((x / (canvas_width - 1)) * 8)

			if (this.props.GetUserColor() === 1) {
				;({ row , column } = Get_Flipped_Row_Column(row, column))
			}

			const newState = {}
			newState.dragging = true
			newState.first_load = this.state.first_load + 1
			newState.old_image_value = this.state.curPosition[row][column]
			if(newState.old_image_value !== 0)
				newState.current_image = this.state.img_dict[this.piece_to_pice_val_dict[this.state.curPosition[row][column]]]
			// clone deep is important as we do not wish to manipulate the previous reference. 
			// i.e we will alter the positions array as this.state.curPosition exists inside positions
			newState.curPosition = _.cloneDeep(this.state.curPosition)
			newState.curPosition[row][column] = 0
			newState.old_image_position = [row, column]
			newState.current_image_position = [x, y]
			this.setState(newState)
		} else if (a_event.button === 2) {
			const newState = {}
			this.StopMouseInputAndCancelMove(newState)
			this.setState(newState)
		}
	}
}

export function Outside_MouseDragHandler(a_event) {
	if (this && a_event.button === 0) {
		if (this.state.dragging) {
			let rect = a_event.currentTarget.getBoundingClientRect();
			let x = a_event.clientX - rect.left;
			let y = a_event.clientY - rect.top;

			let canvas_width = a_event.currentTarget.width
			let canvas_height = a_event.currentTarget.height

			x = x * canvas_width / this.state.canvas_width
			y = y * canvas_height / this.state.canvas_height

			const newState = {}
			newState.current_image_position = [x, y]
			this.setState(newState)
		}
	}
}

export function Outside_MouseUpHandler(a_event) {
	if (this) {
		if (a_event.button === 0 ) {
			//necessary check to ensure that holding right click will not cause bugs
			if(!this.state.dragging) 
				return
			let rect = a_event.currentTarget.getBoundingClientRect();
			let x = a_event.clientX - rect.left;
			let y = a_event.clientY - rect.top;

			let canvas_width = a_event.currentTarget.width
			let canvas_height = a_event.currentTarget.height

			x = x * canvas_width / this.state.canvas_width
			y = y * canvas_height / this.state.canvas_height

			let row = parseInt((y / (canvas_height - 1)) * 8)
			let column = parseInt((x / (canvas_width - 1)) * 8)


			if (this.props.GetUserColor() === 1) {
				;({ row , column } = Get_Flipped_Row_Column(row, column))
			}

			const newState = {}
			let shouldStopMouseInputAndCancelMove = (((this.state.curPosition[row][column] < 10 && this.state.curPosition[row][column] !== 0)
				&& this.state.old_image_value < 10) ||
				(this.state.curPosition[row][column] > 10 && this.state.old_image_value > 10)) &&
				(!(this.state.old_image_position[0] === row && (this.state.old_image_position[1] === column)))
				&& this.state.dragging
				&& this.state.curPosition[row][column] !== 0
			const new_location = Convert_RowCol_To_FileRank(row, column)
			const prev_location = Convert_RowCol_To_FileRank(this.state.old_image_position[0], this.state.old_image_position[1])
			const moveStatus = this.props.GetMoveStatus(prev_location, new_location)
			shouldStopMouseInputAndCancelMove = shouldStopMouseInputAndCancelMove || !moveStatus.isValidMove
			if (shouldStopMouseInputAndCancelMove) {
				this.StopMouseInputAndCancelMove(newState)
				newState.current_image = null
				newState.old_image_value = 0
				newState.dragging = false
				this.setState(newState)
				return
			}
			if (this.state.old_image_value !== 0) {
				newState.curPosition = _.cloneDeep(this.state.curPosition)
				newState.curPosition[row][column] = this.state.old_image_value
				if (!(row === this.state.old_image_position[0] && column === this.state.old_image_position[1])) {
					if (this.state.positions.length === this.state.position_index + 1) {// a new move
						newState.positions = [...this.state.positions].concat([newState.curPosition])
					} else {// delete old branch and overwrtie with this branch
						newState.positions = [...(this.state.positions.slice(0, this.state.position_index + 1))].concat([newState.curPosition])
					}
					newState.position_index = this.state.position_index + 1
				}
			}
			newState.current_image = null
			newState.curPosition[this.state.old_image_position[0]][this.state.old_image_position[1]] = 0
			newState.old_image_value = 0
			newState.dragging = false
			this.setState(newState, () => {
				if (!shouldStopMouseInputAndCancelMove) {
					this.props.CallbackToIndicateMoveIsPlayed(
						prev_location,
						new_location
					)
				}
			})
		}
	}
}

export function Outside_MouseOutHandler(a_event) {
	if (this) {
		const newState = {}
		this.StopMouseInputAndCancelMove(newState)
		this.setState(newState)
	}
}

export function Outside_MouseRightClickHandler(a_event) {
	if (this) {
		a_event.preventDefault()
	}
}