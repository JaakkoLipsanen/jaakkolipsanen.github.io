import * as React from 'react'
import * as pathToRegexp from 'path-to-regexp'

import paths from './paths'
import { BlogListPage } from './views/BlogListPage'
import { BlogPostPage } from './views/BlogPostPage'
import { MainPage } from './views/MainPage'
import { NotFound } from './views/NotFound'

interface RouteTemplate {
	path: string
	forceShrinked?: boolean
	render: (params: Parameters) => JSX.Element
}

export interface Route {
	forceShrinked?: boolean
	render: () => JSX.Element
}

type Parameters = { [k: string]: string | null }

export const routes: RouteTemplate[] = [
	{ path: paths.home, render: (params: Parameters) => <MainPage /> },
	{ path: paths.blogList, render: (params: Parameters) => <BlogListPage /> },
	{
		path: paths.blogPostTemplate,
		forceShrinked: true,
		render: ({ name }: Parameters) => <BlogPostPage name={name!} />
	}
]

export const matchRoute = (path: string): Route => {
	const NOT_FOUND = { render: () => <NotFound /> }

	let foundRoute: Route | null = null
	const found = routes.find(route => {
		const keys: pathToRegexp.Key[] = []
		const regexp = pathToRegexp(route.path, keys)

		const result = regexp.exec(path)
		if (!result) {
			return false
		}

		const PARAMETER_OFFSET = 1
		const parameters: Parameters = keys.reduce(
			(acc: Parameters, cur: pathToRegexp.Key, index: number) => {
				return { ...acc, [cur.name]: result[index + PARAMETER_OFFSET] }
			},
			{}
		)

		foundRoute = {
			forceShrinked: route.forceShrinked,
			render: () => route.render(parameters)
		}
		return true
	})

	return (found && foundRoute) || NOT_FOUND
}
