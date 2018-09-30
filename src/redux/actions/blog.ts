import { action } from 'typesafe-actions'

import { BlogPost, BlogPostInfo } from '../../api/blog'

export const UPDATE_BLOG_POST_INFOS = 'UPDATE_BLOG_POST_INFOS'
export const UPDATE_BLOG_POST = 'UPDATE_BLOG_POST'

export const updateBlogPostInfos = (blogPostInfos: BlogPostInfo[]) =>
	action(UPDATE_BLOG_POST_INFOS, { blogPostInfos })

export const updateBlogPost = (blogPost: BlogPost) =>
	action(UPDATE_BLOG_POST, { blogPost })
