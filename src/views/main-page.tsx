import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import styled from 'styled-components'

import * as blog from '../blog'
import { shuffle } from '../common'
import { BlogPostPreview } from '../components/blog-post-preview'
import { HeroCarousel, HeroCarouselItem } from '../components/hero-carousel'
import { RootState } from '../redux/reducers'
import { recentBlogPostInfosSelector } from '../redux/selectors/blog'

const Mainpage = styled.div`
	width: 100vw;
	margin: auto;
`

const BlogPostListContainer = styled.div`
	width: 70vw;
	max-width: 800px;
	margin: auto;
	margin-top: 128px;
`

interface MainPageProps {
	blogPostInfos: ReadonlyArray<blog.BlogPostInfo>
	slideshowItems: ReadonlyArray<HeroCarouselItem>
}

const _MainPage = ({ blogPostInfos, slideshowItems }: MainPageProps) => (
	<Mainpage>
		<HeroCarousel items={slideshowItems} />
		<BlogPostListContainer>
			{blogPostInfos.map(blogPost => (
				<BlogPostPreview key={blogPost.name} blogPostInfo={blogPost} />
			))}
		</BlogPostListContainer>
	</Mainpage>
)

const slideshowItemsSelector = createSelector(
	(state: RootState) => state.slideshow.items,
	items => shuffle(items)
)

const DISPLAYED_BLOG_POST_COUNT = 6
export const MainPage = connect((state: RootState) => ({
	blogPostInfos: recentBlogPostInfosSelector(DISPLAYED_BLOG_POST_COUNT)(state),
	slideshowItems: slideshowItemsSelector(state)
}))(_MainPage)
