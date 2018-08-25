import { location as actions, LocationActions } from '../actions'
import { history } from '../../routing/history'

export default (state = history.location.pathname, action: LocationActions) => {
	switch (action.type) {
		case actions.UPDATE_LOCATION: {
			const { page } = action.payload
			return page
		}
		default:
			return state
	}
}
