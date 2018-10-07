import { action } from 'typesafe-actions'

import { TripsDetails } from '../../api/trip'

export const UPDATE_TRIP_DETAILS = 'UPDATE_TRIP_DETAILS'
export const updateTripsDetails = (tripDetails: TripsDetails) =>
	action(UPDATE_TRIP_DETAILS, { tripDetails })
