import * as React from 'react'
import styled from 'styled-components'
import * as blog from '../blog'

import { BlogPostPreview } from '../components/blog-post-preview'
import { connect } from 'react-redux'
import { RootState } from '../redux/reducers'
import { recentBlogPostInfosSelector } from '../redux/selectors/blog'

const MainpageLayout = styled.div`
	width: 70vw;
	max-width: 800px;
	margin: auto;
`

interface MainPageProps {
	blogPostInfos: ReadonlyArray<blog.BlogPostInfo>
}

const _MainPage = ({ blogPostInfos }: MainPageProps) => (
	<MainpageLayout>
		{blogPostInfos.map(blogPost => (
			<BlogPostPreview key={blogPost.name} blogPostInfo={blogPost} />
		))}
	</MainpageLayout>
)

const DISPLAYED_BLOG_POST_COUNT = 6
export const MainPage = connect((state: RootState) => ({
	blogPostInfos: recentBlogPostInfosSelector(DISPLAYED_BLOG_POST_COUNT)(state)
}))(_MainPage)
