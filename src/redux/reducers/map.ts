import { map as actions, MapActions } from '../actions'

type MapState = {
	selectedTripShortName?: string
}

const initialState: MapState = {
	selectedTripShortName: undefined
}

export default (state = initialState, action: MapActions) => {
	switch (action.type) {
		case actions.CHANGE_SELECTED_TRIP: {
			const { selectedTripShortName } = action.payload
			return { ...state, selectedTripShortName }
		}
		default:
			return state
	}
}
