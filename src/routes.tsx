import * as React from 'react';
import MainPage from './views/MainPage';
import NotFound from './views/NotFound';

export interface Route { render: () => JSX.Element; }
const routes = [
	{ path: ['', '/'], render: () => <MainPage />}
];

const matchRoute = (path: string) => (
	routes.find(route => route.path.includes(path)) || { render: () => <NotFound /> }
);
	
export default {
	routes,
	matchRoute
};