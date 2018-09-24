import { aws } from './aws'

const loadJson = async (url: string) => {
	const response = await fetch(url)
	return response.json()
}

const loadText = async (url: string) => {
	const response = await fetch(url)
	return response.text()
}

export interface Trip {
	name: string
	shortName: string
	year: string
}

export const fetchTrips = async () => {
	const trips = await loadJson(aws.tripInfosUrl)
	return trips
}

export const fetchRoute = async (routeName: string) => {
	const route = await loadText(aws.getRouteUrl(routeName))
	return route
}
