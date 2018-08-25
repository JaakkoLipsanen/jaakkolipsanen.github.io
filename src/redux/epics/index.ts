import { combineEpics } from 'redux-observable'
import locationEpics from './location'

export default combineEpics(locationEpics)
