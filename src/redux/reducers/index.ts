import { combineReducers } from 'redux'
import location from './location'
import { StateType } from 'typesafe-actions'

const reducers = combineReducers({
	location
})

export type RootState = StateType<typeof reducers>
export default reducers
