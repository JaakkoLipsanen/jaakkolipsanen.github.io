import * as React from 'react'
import { createSelector } from 'reselect'
import { matchRoute, Route } from '../routing/routes'
import { Navbar } from '../components/navbar'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers'

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
