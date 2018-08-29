import { Epic, ofType } from 'redux-observable'
import { fromEvent } from 'rxjs'
import { filter, map, switchMap, take } from 'rxjs/operators'

import { RootActions } from '../actions'
import { updateIsPageVisible } from '../actions/common'
import { RootState } from '../reducers'

const pageVisbility$ = fromEvent(document, 'visibilitychange')
const listenForPageVisibilityChange$: Epic<
	RootActions,
	RootActions,
	RootState
> = (action$, state$) =>
	action$.pipe(
		ofType('INIT'),
		take(1),
		switchMap(_ => pageVisbility$),
		map(() => document.visibilityState === 'visible'),
		filter(isVisible => state$.value.common.isPageVisible !== isVisible),
		map(updateIsPageVisible)
	)

export default listenForPageVisibilityChange$
