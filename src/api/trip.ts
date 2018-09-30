import { aws } from '../aws'
import { loadJson } from '../common'

export interface Trip {
	name: string
	shortName: string
	year: string
}

export const fetchTrips = async () => {
	const trips = await loadJson(aws.tripInfosUrl)
	return trips
}
