import { combineEpics } from 'redux-observable'

import blogEpics from './blog'
import commonEpics from './common'
import locationEpics from './location'
import routeEpics from './route'
import tripEpics from './trip'

export default combineEpics(
	locationEpics,
	blogEpics,
	commonEpics,
	tripEpics,
	routeEpics
)
