import { Epic, ofType } from 'redux-observable'
import { Observable } from 'rxjs'
import { map, switchMap, take, filter } from 'rxjs/operators'
import { history } from '../../routing/history'
import { RootActions } from '../actions'
import { RootState } from '../reducers'
import { updateLocation } from '../actions/location'
import { Location } from 'history'

const history$ = Observable.create((observer: any) => {
	history.listen(location => observer.next(location))
})

const listenToPathChange$: Epic<RootActions, RootActions, RootState> = (
	action$,
	state$
) =>
	action$.pipe(
		ofType('INIT'),
		take(1),
		switchMap(_ => history$),
		filter(
			(location: Location) => location.pathname !== state$.value.location
		),
		map(location => updateLocation(location.pathname))
	)

export default listenToPathChange$
