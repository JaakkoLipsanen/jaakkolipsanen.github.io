export interface LatLng {
	lat: number
	lng: number
}

export type PathType = 'transport' | 'legit'
export type NightType = 'hotel' | 'tent'

export type CoordinateItem = { type: 'coordinate'; latlng: LatLng }
export type NightItem = { type: 'night'; nightType: NightType }

export type Point = CoordinateItem | NightItem
export interface Path {
	points: Point[]
	pathType: PathType
}

export interface Route {
	paths: Path[]
}

export type RoutesByTripShortName = {
	[id: string]: Route
}
