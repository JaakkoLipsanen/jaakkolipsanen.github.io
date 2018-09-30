import { Epic, ofType } from 'redux-observable'
import { map, switchMap, take } from 'rxjs/operators'

import { fetchTrips } from '../../api/trip'
import { RootActions } from '../actions'
import { updateTrips } from '../actions/trip'
import { RootState } from '../reducers'

const loadTrips$: Epic<RootActions, RootActions, RootState> = action$ =>
	action$.pipe(
		ofType('INIT'),
		take(1),
		switchMap(fetchTrips),
		map(updateTrips)
	)

export default loadTrips$
