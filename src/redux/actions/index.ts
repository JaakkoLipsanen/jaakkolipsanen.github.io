import { ActionType } from 'typesafe-actions'

import * as blog from './blog'
import * as common from './common'
import * as location from './location'

export { location, blog, common }
export type LocationActions = ActionType<typeof location>
export type BlogActions = ActionType<typeof blog>
export type CommonActions = ActionType<typeof common>

export type InitAction = { type: 'INIT' }
export type RootActions =
	| LocationActions
	| BlogActions
	| CommonActions
	| InitAction
