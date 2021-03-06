import * as R from 'ramda'
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
import { TripSelector } from '../components/trip-selector'
import { TripStats } from '../components/trip-stats'
import { Route } from '../maps'
import { changeSelectedTrip as changeSelectedTripAction } from '../redux/actions/map'
import { RootState } from '../redux/reducers'
import { createRecentBlogPostInfosSelector } from '../redux/selectors/blog'
import { combinedRoutesAndTripsSelector, totalRouteLengthsInKm } from '../redux/selectors/route'

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
	width: 100%;
	height: 60vh;
	min-height: 400px;
	padding-top: 16px;
	margin: auto;
	margin-bottom: 8px;

	@media (min-width: 1200px) {
		width: calc(1200px * 0.9);
	}
`

const CONTENT_MAX_WIDTH = '90%'
const MaxWidthContainer = styled.div`
	margin: auto;
	max-width: ${CONTENT_MAX_WIDTH};
`

const BlogPostList = styled.div`
	width: 100%;
	padding-top: 20px;
	margin: auto;
	overflow: hidden;

	display: grid;
	grid-gap: 0 32px;
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
	tripStats: TripStats
	selectedTripShortName?: string
	changeSelectedTrip: (selectedTripShortName?: string) => void
}

const _MainPage = ({
	blogPostInfos,
	slideshowItems,
	autoplaySlideshow,
	routes,
	tripStats,
	selectedTripShortName,
	changeSelectedTrip
}: MainPageProps) => (
	<Mainpage>
		<HeroCarousel items={slideshowItems} autoplay={autoplaySlideshow} />
		<BlogPostListContainer>
			<MaxWidthContainer>
				<MoreBelowIndicator />
				<TripStats {...tripStats} />
				<MapContainer>
					<Map
						routes={routes}
						selectedTripShortName={selectedTripShortName}
						changeSelectedTrip={changeSelectedTrip}
					/>
				</MapContainer>
				<TripSelector
					trips={R.pluck('trip', routes)}
					selectedTripShortName={selectedTripShortName}
					changeSelectedTrip={changeSelectedTrip}
				/>
				<BlogPostList>
					{blogPostInfos.map(blogPost => (
						<BlogPostPreview
							key={blogPost.name}
							blogPostInfo={blogPost}
						/>
					))}
				</BlogPostList>
			</MaxWidthContainer>
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

const tripStatsSelector = createSelector(
	combinedRoutesAndTripsSelector,
	totalRouteLengthsInKm,
	(state: RootState) => state.trip.countries,
	(routes, totalRoutesLength, totalCountries) => ({
		trips: routes.length,
		countries: totalCountries,
		kilometers: totalRoutesLength
	})
)

const mapStateToProps = (state: RootState) => ({
	blogPostInfos: recentBlogPostInfosSelector(state),
	slideshowItems: slideshowItemsSelector(state),
	routes: combinedRoutesAndTripsSelector(state),
	tripStats: tripStatsSelector(state),
	selectedTripShortName: state.map.selectedTripShortName,
	autoplaySlideshow:
		state.common.isPageVisible &&
		state.common.bodyScrollY < window.innerHeight
})

export const MainPage = connect(
	mapStateToProps,
	dispatch => ({
		changeSelectedTrip: (selectedTripShortName?: string) =>
			dispatch(changeSelectedTripAction(selectedTripShortName))
	})
)(_MainPage)
