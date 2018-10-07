import { Trip } from '../../api/trip'
import { trip as actions, TripActions } from '../actions'

type TripState = {
	trips: ReadonlyArray<Trip>
	currentTrip: number
	countries: number
}

const initialState: TripState = {
	trips: [],
	currentTrip: 0,
	countries: 0
}

export default (state = initialState, action: TripActions) => {
	switch (action.type) {
		case actions.UPDATE_TRIP_DETAILS: {
			const { tripDetails } = action.payload
			return { ...state, ...tripDetails }
		}
		default:
			return state
	}
}
