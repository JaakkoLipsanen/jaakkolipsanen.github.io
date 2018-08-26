import * as R from 'ramda'
import { BlogPostInfo, BlogPost } from '../../blog'
import { blog as actions, BlogActions } from '../actions'

type BlogState = {
	blogPostInfos: ReadonlyArray<BlogPostInfo>
	blogPosts: ReadonlyArray<BlogPost>
}

const initialState: BlogState = {
	blogPostInfos: [],
	blogPosts: []
}

export default (state = initialState, action: BlogActions) => {
	switch (action.type) {
		case actions.UPDATE_BLOG_POST_INFOS: {
			const { blogPostInfos } = action.payload
			return { ...state, blogPostInfos }
		}
		case actions.UPDATE_BLOG_POST: {
			const { blogPost } = action.payload
			return {
				...state,
				blogPosts: R.uniqBy(({ name }) => name, [
					...state.blogPosts,
					blogPost
				])
			}
		}
		default:
			return state
	}
}
