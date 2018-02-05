import * as React from 'react';
import * as pathToRegexp from 'path-to-regexp';

import paths from './paths';
import MainPage from './views/MainPage';
import BlogPostPage from './views/BlogPostPage';
import NotFound from './views/NotFound';

export interface Route { render: () => JSX.Element; }
type Parameters = { [k: string]: string | null };

const routes = [
	{ path: paths.home, render: (params: Parameters) => <MainPage />},
	{ path: paths.blogPostTemplate, render: ({ name }: Parameters) => <BlogPostPage name={name!} />}
];

const matchRoute = (path: string): Route => {
	const NOT_FOUND = { render: () => <NotFound /> };

	let foundRoute: Route | null = null;
	const found = routes.find(route => {
		const keys: pathToRegexp.Key[] = [];
		const regexp = pathToRegexp(route.path, keys);

		const result = regexp.exec(path);
		if (!result) {
			return false;
		}
		
		const PARAMETER_OFFSET = 1;
		const parameters: Parameters = keys.reduce(
			(acc: Parameters, cur: pathToRegexp.Key, index: number) => {
				return { ...acc, [cur.name]: result[index + PARAMETER_OFFSET] };
			}, 
			{ }
		);

		foundRoute = { render: () => route.render(parameters) };
		return true;
	});

	return (found && foundRoute) || NOT_FOUND;
};
	
export default {
	routes,
	matchRoute
};