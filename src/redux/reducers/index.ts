import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'
import location from './location'
import blog from './blog'

const reducers = combineReducers({
	location,
	blog
})

export type RootState = StateType<typeof reducers>
export default reducers
