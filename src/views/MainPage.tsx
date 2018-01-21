import * as React from 'react';
import history from '../history';

class MainPage extends React.Component<{}, {}> {
	render() {
		return (
			<div className="App">
				<a onClick={() => history.push('/404')}>test</a>
			</div>
		);
	}
}

export default MainPage;
