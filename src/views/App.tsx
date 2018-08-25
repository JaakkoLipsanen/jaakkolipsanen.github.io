import * as React from 'react'
import { history } from '../history'
import { matchRoute, Route } from '../routes'
import { Navbar } from '../components/navbar'

interface AppState {
	currentRoute: Route
}

export class App extends React.Component<{}, AppState> {
	state: AppState = {
		currentRoute: matchRoute(history.location.pathname)
	}

	componentDidMount() {
		history.listen(location =>
			this.setState({ currentRoute: matchRoute(location.pathname) })
		)
	}

	render() {
		const CurrentRoute = () => this.state.currentRoute.render()
		return (
			<>
				<Navbar
					forceShrinked={Boolean(this.state.currentRoute.forceShrinked)}
				/>
				<CurrentRoute />
			</>
		)
	}
}
