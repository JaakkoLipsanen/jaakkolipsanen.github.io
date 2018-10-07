import { Epic, ofType } from 'redux-observable'
import { map, switchMap, take } from 'rxjs/operators'

import { fetchTripDetails } from '../../api/trip'
import { RootActions } from '../actions'
import { updateTripsDetails } from '../actions/trip'
import { RootState } from '../reducers'

const loadTripDetails$: Epic<RootActions, RootActions, RootState> = action$ =>
	action$.pipe(
		ofType('INIT'),
		take(1),
		switchMap(fetchTripDetails),
		map(updateTripsDetails)
	)

export default loadTripDetails$
