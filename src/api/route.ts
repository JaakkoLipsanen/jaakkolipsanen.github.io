import * as R from 'ramda'

import { aws } from '../aws'
import { loadText } from '../common'
import { CoordinateItem, Path, Point, Route } from '../maps'
import { Trip } from './trip'

const getLastCoordinateItem = (points: Point[]) =>
	R.findLast((p: Point) => p.type === 'coordinate')(points) as CoordinateItem

const parseRoute = (routeFile: string): Route => {
	const lines = routeFile
		.split('\n')
		.map(line => line.trim())
		.filter(line => line.length > 0 && !line.startsWith('//'))

	const paths: Path[] = lines.reduce(
		(acc: Path[], line: string) => {
			const currentPath = acc[acc.length - 1]
			if (line.startsWith('n ') || line.startsWith('night ')) {
				currentPath.points.push({
					type: 'night',
					nightType: line.split(' ')[1] === 't' ? 'tent' : 'hotel'
				})
			} else if (line.startsWith('t ')) {
				acc.push({
					points: [getLastCoordinateItem(currentPath.points)],
					pathType: line.split(' ')[1] === 't' ? 'transport' : 'legit'
				})
			} else {
				const latlng = R.take(2, line.split(' ')).map(parseFloat)
				currentPath.points.push({
					type: 'coordinate',
					latlng: { lat: latlng[0], lng: latlng[1] }
				})
			}

			return acc
		},
		[{ points: [], pathType: 'legit' }]
	)

	return { paths }
}

export const fetchRoute = async (trip: Trip) => {
	const routeFile = await loadText(aws.getRouteUrl(trip))
	return parseRoute(routeFile)
}
