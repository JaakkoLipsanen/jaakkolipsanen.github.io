import { common as actions, CommonActions } from '../actions'

const initialState = {
	isPageVisible: true,
	bodyScrollY: 0
}

export default (state = initialState, action: CommonActions) => {
	switch (action.type) {
		case actions.UPDATE_IS_PAGE_VISIBLE: {
			const { isPageVisible } = action.payload
			return { ...state, isPageVisible }
		}
		case actions.UPDATE_BODY_SCROLL_Y: {
			const { bodyScrollY } = action.payload
			return { ...state, bodyScrollY }
		}
		default:
			return state
	}
}
