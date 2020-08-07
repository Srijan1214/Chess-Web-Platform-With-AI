import _ from "lodash"
import {
	convert_rowCol_to_fileRank
} from "../../utility_functions/Utility.js"
import { get_flipped_row_column } from "../../utility_functions/Utility.js"

export function Outside_mouseClickHandler(event) {
	if (this) {
		if (event.button === 0) {
			if(this.state.should_block_user_input){
				return
			}
			let rect = event.currentTarget.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;

			let canvas_width = event.currentTarget.width
			let canvas_height = event.currentTarget.height

			x = x * canvas_width / this.state.canvas_width
			y = y * canvas_height / this.state.canvas_height

			let r = parseInt((y / (canvas_height - 1)) * 8)
			let c = parseInt((x / (canvas_width - 1)) * 8)

			if (this.user_color === 1) {
				;({ r, c } = get_flipped_row_column(r, c))
			}

			const newState = {}
			newState.dragging = true
			newState.first_load = this.state.first_load + 1
			newState.old_image_value = this.state.curPosition[r][c]
			if(newState.old_image_value !== 0)
				newState.current_image = this.state.img_dict[this.piece_to_pice_val_dict[this.state.curPosition[r][c]]]
			// clone deep is important as we do not wish to manipulate the previous reference. 
			// i.e we will alter the positions array as this.state.curPosition exists inside positions
			newState.curPosition = _.cloneDeep(this.state.curPosition)
			newState.curPosition[r][c] = 0
			newState.old_image_position = [r, c]
			newState.current_image_position = [x, y]
			this.setState(newState)
		} else if (event.button === 2) {
			const newState = {}
			this.cancelMove(newState)
			this.setState(newState)
		}
	}
}

export function Outside_mouseDragHandler(event) {
	if (this && event.button === 0) {
		if (this.state.dragging) {
			let rect = event.currentTarget.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;

			let canvas_width = event.currentTarget.width
			let canvas_height = event.currentTarget.height

			x = x * canvas_width / this.state.canvas_width
			y = y * canvas_height / this.state.canvas_height

			const newState = {}
			newState.current_image_position = [x, y]
			this.setState(newState)
		}
	}
}

export function Outside_mouseUpHandler(event) {
	if (this) {
		if (event.button === 0 ) {
			//necessary check to ensure that holding right click will not cause bugs
			if(!this.state.dragging) 
				return
			let rect = event.currentTarget.getBoundingClientRect();
			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;

			let canvas_width = event.currentTarget.width
			let canvas_height = event.currentTarget.height

			x = x * canvas_width / this.state.canvas_width
			y = y * canvas_height / this.state.canvas_height

			let r = parseInt((y / (canvas_height - 1)) * 8)
			let c = parseInt((x / (canvas_width - 1)) * 8)


			if (this.user_color === 1) {
				;({ r, c } = get_flipped_row_column(r, c))
			}

			const newState = {}
			let shouldCancelMove = (((this.state.curPosition[r][c] < 10 && this.state.curPosition[r][c] !== 0)
				&& this.state.old_image_value < 10) ||
				(this.state.curPosition[r][c] > 10 && this.state.old_image_value > 10)) &&
				(!(this.state.old_image_position[0] === r && (this.state.old_image_position[1] === c)))
				&& this.state.dragging
				&& this.state.curPosition[r][c] !== 0
			const new_location = convert_rowCol_to_fileRank(r, c)
			const prev_location = convert_rowCol_to_fileRank(this.state.old_image_position[0], this.state.old_image_position[1])
			const moveStatus = this.props.get_move_status(prev_location, new_location)
			shouldCancelMove = shouldCancelMove || !moveStatus.isValidMove
			if (shouldCancelMove) {
				this.cancelMove(newState)
				newState.current_image = null
				newState.old_image_value = 0
				newState.dragging = false
				this.setState(newState)
				return
			}
			if (this.state.old_image_value !== 0) {
				newState.curPosition = _.cloneDeep(this.state.curPosition)
				newState.curPosition[r][c] = this.state.old_image_value
				if (!(r === this.state.old_image_position[0] && c === this.state.old_image_position[1])) {
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
				if (!shouldCancelMove) {
					this.props.callback_to_indicate_move_is_played(
						prev_location,
						new_location
					)
				}
			})
		}
	}
}

export function Outside_MouseRightClickHandler(event) {
	if (this) {
		event.preventDefault()
	}
}

export function Outside_KeyboardPressHandler(event) {
	if (this) {
		if(this.state.should_block_user_input){
			return
		}
		if (event.key === "ArrowRight") {
			if (this.state.position_index < this.state.positions.length - 1) {
				const newState = {}
				newState.position_index = this.state.position_index + 1;
				newState.curPosition = this.state.positions[newState.position_index]
				this.setState(newState)
			}
		} else if (event.key === "ArrowLeft") {
			if (this.state.position_index > 0) {
				const newState = {}
				newState.position_index = this.state.position_index - 1
				newState.curPosition = this.state.positions[newState.position_index]
				this.setState(newState)
			}
		} else if (event.key === "ArrowUp") {
			if (this.state.positions.length > 0) {
				const newState = {}
				newState.position_index = this.state.positions.length - 1
				newState.curPosition = this.state.positions[newState.position_index]
				this.setState(newState)
			}
		} else if (event.key === "ArrowDown") {
			if (this.state.positions.length > 0) {
				const newState = {}
				newState.position_index = 0
				newState.curPosition = this.state.positions[newState.position_index]
				this.setState(newState)
			}
		}
	}
}