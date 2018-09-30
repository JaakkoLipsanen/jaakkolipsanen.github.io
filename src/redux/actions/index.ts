import { ActionType } from 'typesafe-actions'

import * as blog from './blog'
import * as common from './common'
import * as location from './location'
import * as route from './route'
import * as trip from './trip'

export { location, blog, common, trip, route }
export type LocationActions = ActionType<typeof location>
export type BlogActions = ActionType<typeof blog>
export type TripActions = ActionType<typeof trip>
export type RouteActions = ActionType<typeof route>
export type CommonActions = ActionType<typeof common>

export type InitAction = { type: 'INIT' }
export type RootActions =
	| LocationActions
	| BlogActions
	| CommonActions
	| TripActions
	| RouteActions
	| InitAction
