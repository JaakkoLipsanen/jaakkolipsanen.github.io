import { action } from 'typesafe-actions'

import { Route } from '../../maps'

export const UPDATE_ROUTES = 'UPDATE_ROUTES'

export const updateRoutes = (routesByTripShortName: { [id: string]: Route }) =>
	action(UPDATE_ROUTES, { routesByTripShortName })
