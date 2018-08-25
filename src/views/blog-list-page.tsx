import * as React from 'react'
import styled from 'styled-components'
import * as blog from '../blog'
import { BlogPostPreview } from '../components/blog-post-preview'

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

export class BlogListPage extends React.Component<{}, {}> {
	render() {
		const blogPostInfosToRender = blog
			.getBlogPostInfos()
			.slice()
			.reverse()

		return (
			<BlogListPageLayout>
				{blogPostInfosToRender.map(blogPost => (
					<BlogPostPreview key={blogPost.name} blogPostInfo={blogPost} />
				))}
			</BlogListPageLayout>
		)
	}
}
