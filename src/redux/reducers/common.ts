import { common as actions, CommonActions } from '../actions'

const initialState = {
	isPageVisible: true
}

export default (state = initialState, action: CommonActions) => {
	switch (action.type) {
		case actions.UPDATE_IS_PAGE_VISIBLE: {
			const { isPageVisible } = action.payload
			return { ...state, isPageVisible }
		}
		default:
			return state
	}
}
