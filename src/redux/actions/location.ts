import { action } from 'typesafe-actions'

export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const updateLocation = (page: string) =>
	action(UPDATE_LOCATION, { page })
