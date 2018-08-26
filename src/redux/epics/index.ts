import { combineEpics } from 'redux-observable'
import locationEpics from './location'
import blogEpics from './blog'

export default combineEpics(locationEpics, blogEpics)
