import { combineEpics } from 'redux-observable'

import blogEpics from './blog'
import commonEpics from './common'
import locationEpics from './location'

export default combineEpics(locationEpics, blogEpics, commonEpics)
