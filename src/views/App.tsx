import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'

import { Navbar } from '../components/navbar'
import { RootState } from '../redux/reducers'
import { matchRoute, Route } from '../routing/routes'

interface AppProps {
	currentRoute: Route
}

const _App = ({ currentRoute }: AppProps) => (
	<React.Fragment>
		<Navbar forceShrinked={Boolean(currentRoute.forceShrinked)} />
		<currentRoute.render />
	</React.Fragment>
)

const routeSelector = createSelector(
	(state: RootState) => state.location,
	location => matchRoute(location)
)

const mapStateToProps = (state: RootState) => ({
	currentRoute: routeSelector(state)
})

export const App = connect(mapStateToProps)(_App)
