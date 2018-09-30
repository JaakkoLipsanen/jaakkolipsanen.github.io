import { action } from 'typesafe-actions'

import { Trip } from '../../api/trip'

export const UPDATE_TRIPS = 'UPDATE_TRIPS'
export const updateTrips = (trips: Trip[]) => action(UPDATE_TRIPS, { trips })
