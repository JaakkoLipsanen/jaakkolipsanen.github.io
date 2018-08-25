import * as React from 'react'
import styled from 'styled-components'
import * as blog from '../blog'

import { BlogPostPreview } from '../components/BlogPostPreview'

const MainpageLayout = styled.div`
	width: 70vw;
	max-width: 800px;
	margin: auto;
`

export class MainPage extends React.Component<{}, {}> {
	render() {
		const blogPostInfosToRender = blog
			.getBlogPostInfos()
			.slice()
			.reverse()
			.slice(0, 6)
		return (
			<MainpageLayout>
				{blogPostInfosToRender.map(blogPost => (
					<BlogPostPreview key={blogPost.name} blogPostInfo={blogPost} />
				))}
			</MainpageLayout>
		)
	}
}
