import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'

import blog from './blog'
import location from './location'
import slideshow from './slideshow'

const reducers = combineReducers({
	location,
	blog,
	slideshow
})

export type RootState = StateType<typeof reducers>
export default reducers
