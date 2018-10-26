import { action } from 'typesafe-actions'

export const CHANGE_SELECTED_TRIP = 'CHANGE_SELECTED_TRIP'
export const changeSelectedTrip = (selectedTripShortName?: string) =>
	action(CHANGE_SELECTED_TRIP, { selectedTripShortName })
