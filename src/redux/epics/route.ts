import * as R from 'ramda'
import { Epic, ofType } from 'redux-observable'
import { map, switchMap } from 'rxjs/operators'

import { fetchRoute } from '../../api/route'
import { RootActions, TripActions } from '../actions'
import { updateRoutes } from '../actions/route'
import { UPDATE_TRIPS } from '../actions/trip'
import { RootState } from '../reducers'

const loadTrips$: Epic<RootActions, RootActions, RootState> = action$ =>
	action$.pipe(
		ofType<TripActions>(UPDATE_TRIPS),
		switchMap(async ({ payload }) => {
			const trips = payload.trips
			const routes = await Promise.all(trips.map(fetchRoute))
			return R.zipObj(trips.map(trip => trip.shortName), routes)
		}),
		map(updateRoutes)
	)

export default loadTrips$
