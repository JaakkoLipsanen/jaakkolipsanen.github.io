import { ActionType } from 'typesafe-actions'

import * as blog from './blog'
import * as common from './common'
import * as location from './location'
import * as trip from './trip'

export { location, blog, common, trip }
export type LocationActions = ActionType<typeof location>
export type BlogActions = ActionType<typeof blog>
export type TripActions = ActionType<typeof trip>
export type CommonActions = ActionType<typeof common>

export type InitAction = { type: 'INIT' }
export type RootActions =
	| LocationActions
	| BlogActions
	| CommonActions
	| TripActions
	| InitAction
