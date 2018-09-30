import { Trip } from '../../api/trip'
import { trip as actions, TripActions } from '../actions'

type TripState = {
	trips: ReadonlyArray<Trip>
}

const initialState: TripState = {
	trips: []
}

export default (state = initialState, action: TripActions) => {
	switch (action.type) {
		case actions.UPDATE_TRIPS: {
			const { trips } = action.payload
			return { ...state, trips }
		}
		default:
			return state
	}
}
