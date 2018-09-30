import { ActionsObservable, combineEpics, Epic, ofType, StateObservable } from 'redux-observable'
import { filter, map, switchMap, take } from 'rxjs/operators'

import { fetchBlogPost, fetchBlogPostInfos } from '../../api/blog'
import { BlogActions, InitAction, LocationActions, RootActions } from '../actions'
import { updateBlogPost, updateBlogPostInfos } from '../actions/blog'
import { UPDATE_LOCATION } from '../actions/location'
import { RootState } from '../reducers'
import { blogPostByNameSelector } from '../selectors/blog'

const loadBlogPostInfos$: Epic<RootActions, RootActions, RootState> = action$ =>
	action$.pipe(
		ofType('INIT'),
		take(1),
		switchMap(fetchBlogPostInfos.bind(null)),
		map(updateBlogPostInfos)
	)

const locationChanged$ = (
	action$: ActionsObservable<RootActions>,
	state$: StateObservable<RootState>
) =>
	action$.pipe(
		ofType<RootActions, LocationActions | InitAction>(
			UPDATE_LOCATION,
			'INIT'
		),
		map(
			action =>
				action.type === UPDATE_LOCATION
					? action.payload.page
					: state$.value.location
		)
	)

const loadBlogPost$: Epic<RootActions, BlogActions, RootState> = (
	action$,
	state$
) =>
	locationChanged$(action$, state$).pipe(
		filter(location => location.startsWith('/blog/')),
		map(location => location.split('/')[2]), // TODO: this stuff is haxy, but my router doesn't expose parameters in anyway :/
		filter(name => !blogPostByNameSelector(name)(state$.value)), // dont refetch if it already exists
		switchMap(fetchBlogPost),
		map(updateBlogPost)
	)

export default combineEpics(loadBlogPostInfos$, loadBlogPost$)
