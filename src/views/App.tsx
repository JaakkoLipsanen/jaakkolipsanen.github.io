import * as React from 'react';
import routes, { Route } from '../routes';
import history from '../history';

import Navbar from '../components/Navbar';

interface AppState {
	currentRoute: Route;
}

class App extends React.Component<{}, AppState> {
	state: AppState = {
		currentRoute: routes.matchRoute(history.location.pathname)
	};

	componentDidMount() {
		history.listen(location => this.setState({ currentRoute: routes.matchRoute(location.pathname) }));
	}

	render() {
		const CurrentRoute = () => this.state.currentRoute.render();
		return (
			<div>
				<Navbar />
				<CurrentRoute />
			</div>
		);
	}
}

export default App;