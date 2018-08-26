import * as React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import * as blog from '../blog'
import { BlogPostPreview } from '../components/blog-post-preview'
import { RootState } from '../redux/reducers'
import { recentBlogPostInfosSelector } from '../redux/selectors/blog'

const BlogListPageLayout = styled.div`
	width: 85vw;
	max-width: 1600px;
	margin: auto;

	display: grid;
	grid-column-gap: 48px;

	grid-template-columns: 1fr;
	@media screen and (min-width: 940px) {
		grid-template-columns: 1fr 1fr;
	}

	@media screen and (min-width: 1400px) {
		grid-template-columns: 1fr 1fr 1fr;
	}
`

interface BlogListPageProps {
	blogPostInfos: ReadonlyArray<blog.BlogPostInfo>
}

const _BlogListPage = ({ blogPostInfos }: BlogListPageProps) => (
	<BlogListPageLayout>
		{blogPostInfos.map(blogPost => (
			<BlogPostPreview key={blogPost.name} blogPostInfo={blogPost} />
		))}
	</BlogListPageLayout>
)

export const BlogListPage = connect((state: RootState) => ({
	blogPostInfos: recentBlogPostInfosSelector()(state)
}))(_BlogListPage)
