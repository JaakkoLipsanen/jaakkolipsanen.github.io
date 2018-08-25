import { ActionType } from 'typesafe-actions'
import * as location from './location'

export { location }
export type LocationActions = ActionType<typeof location>

export type RootActions = LocationActions | { type: 'INIT' }
