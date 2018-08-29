import { createSelector } from 'reselect'

import { RootState } from '../reducers'

export const createRecentBlogPostInfosSelector = (
	amount: number | null = null
) =>
	createSelector(
		(state: RootState) => state.blog.blogPostInfos,
		blogPostInfos =>
			blogPostInfos
				.slice()
				.reverse()
				.slice(0, amount ? amount : 99999)
	)

export const blogPostByNameSelector = (name: string) =>
	createSelector(
		(state: RootState) => state.blog.blogPosts,
		blogPosts => blogPosts.find(({ name: _name }) => _name === name)
	)
