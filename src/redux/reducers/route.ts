import { Route } from '../../maps'
import { route as actions, RouteActions } from '../actions'

type RouteState = {
	routesByTripShortName: { [id: string]: Route }
}

const initialState: RouteState = {
	routesByTripShortName: {}
}

export default (state = initialState, action: RouteActions) => {
	switch (action.type) {
		case actions.UPDATE_ROUTES: {
			const { routesByTripShortName } = action.payload
			return { ...state, routesByTripShortName }
		}
		default:
			return state
	}
}
