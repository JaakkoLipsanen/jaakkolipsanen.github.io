import { combineReducers } from 'redux'
import { StateType } from 'typesafe-actions'

import blog from './blog'
import common from './common'
import location from './location'
import map from './map'
import route from './route'
import slideshow from './slideshow'
import trip from './trip'

const reducers = combineReducers({
	location,
	blog,
	slideshow,
	common,
	trip,
	route,
	map
})

export type RootState = StateType<typeof reducers>
export default reducers
