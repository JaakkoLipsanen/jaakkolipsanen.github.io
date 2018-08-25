import { ActionType } from 'typesafe-actions'

import * as actions from '../actions/page'
export type PageActions = ActionType<typeof actions>

export default (state = 'home', action: PageActions) => {
	switch (action.type) {
		case actions.CHANGE_PAGE: {
			const { page } = action.payload
			return page
		}
		default:
			return state
	}
}
