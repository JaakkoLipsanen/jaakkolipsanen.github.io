import { ActionType } from 'typesafe-actions'
import * as location from './location'
import * as blog from './blog'

export { location, blog }
export type LocationActions = ActionType<typeof location>
export type BlogActions = ActionType<typeof blog>

export type InitAction = { type: 'INIT' }
export type RootActions = LocationActions | BlogActions | InitAction
