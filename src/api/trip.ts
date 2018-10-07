import { aws } from '../aws'
import { loadJson } from '../common'

export interface Trip {
	name: string
	shortName: string
	year: string
	startDate: string
}

interface TourDetails {
	currentTour: number
	countries: number
	tours: Trip[]
}

export interface TripsDetails {
	currentTrip: number
	countries: number
	trips: Trip[]
}

export const fetchTripDetails = async () => {
	const { tours, currentTour, countries }: TourDetails = await loadJson(
		aws.tripInfosUrl
	)

	return { trips: tours, currentTrip: currentTour, countries }
}
