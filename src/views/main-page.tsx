import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import styled from 'styled-components'

import * as blog from '../api/blog'
import { Trip } from '../api/trip'
import { shuffle } from '../common'
import { BlogPostPreview } from '../components/blog-post-preview'
import { HeroCarousel, HeroCarouselItem } from '../components/hero-carousel'
import Map from '../components/map'
import { Route } from '../maps'
import { RootState } from '../redux/reducers'
import { createRecentBlogPostInfosSelector } from '../redux/selectors/blog'

const Mainpage = styled.div`
	width: 100%;
	margin: auto;
`

const BlogPostListContainer = styled.div`
	width: 100%;
	min-height: 66vh;
	position: relative;
	background-color: white;
`

const MapContainer = styled.div`
	width: 90%;
	height: 60vh;
	min-height: 400px;
	padding-top: 32px;
	margin: auto;

	@media (min-width: 1200px) {
		width: calc(1200px * 0.9);
	}
`

const BlogPostList = styled.div`
	width: 90%;
	padding-top: 32px;
	margin: auto;
	overflow: hidden;

	display: grid;
	grid-gap: 4%;
	grid-template-columns: repeat(1, 1fr);

	@media (min-width: 900px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 1200px) {
		width: calc(1200px * 0.9);
	}
`

const MoreBelowIndicator = styled.div`
	position: absolute;
	top: 0;
	left: 50%;
	transform: translate(-50%, -100%);
	width: 3px;
	height: 72px;
	background-color: white;
`

interface MainPageProps {
	blogPostInfos: ReadonlyArray<blog.BlogPostInfo>
	slideshowItems: ReadonlyArray<HeroCarouselItem>
	autoplaySlideshow: boolean
	routes: ReadonlyArray<{ trip: Trip; route: Route }>
}

const _MainPage = ({
	blogPostInfos,
	slideshowItems,
	autoplaySlideshow,
	routes
}: MainPageProps) => (
	<Mainpage>
		<HeroCarousel items={slideshowItems} autoplay={autoplaySlideshow} />
		<BlogPostListContainer>
			<MoreBelowIndicator />
			<MapContainer>
				<Map routes={routes} />
			</MapContainer>
			<BlogPostList>
				{blogPostInfos.map(blogPost => (
					<BlogPostPreview key={blogPost.name} blogPostInfo={blogPost} />
				))}
			</BlogPostList>
		</BlogPostListContainer>
	</Mainpage>
)

const slideshowItemsSelector = createSelector(
	(state: RootState) => state.slideshow.items,
	items => shuffle(items)
)

// TODO: create a 'show more' button. Initially show only 6 or 10 or something, when clicked show all posts
const DISPLAYED_BLOG_POST_COUNT = undefined
const recentBlogPostInfosSelector = createRecentBlogPostInfosSelector(
	DISPLAYED_BLOG_POST_COUNT
)

const routesSelector = createSelector(
	(state: RootState) => state.route.routesByTripShortName,
	(state: RootState) => state.trip.trips,
	(routesByTripShortName, trips) =>
		trips.map(trip => ({
			trip,
			route: routesByTripShortName[trip.shortName]
		}))
)

export const MainPage = connect((state: RootState) => ({
	blogPostInfos: recentBlogPostInfosSelector(state),
	slideshowItems: slideshowItemsSelector(state),
	routes: routesSelector(state),
	autoplaySlideshow:
		state.common.isPageVisible &&
		state.common.bodyScrollY < window.innerHeight
}))(_MainPage)
