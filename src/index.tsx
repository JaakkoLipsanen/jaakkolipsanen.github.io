import * as ReactDOM from 'react-dom';
import routes from './routes';
import history from './history';
import './global.css';

const renderRoute = (path: string) => {
	const route = routes.matchRoute(path);
	ReactDOM.render(route.render(), document.getElementById('root'));
};

renderRoute(history.location.pathname);
history.listen(location => renderRoute(location.pathname));