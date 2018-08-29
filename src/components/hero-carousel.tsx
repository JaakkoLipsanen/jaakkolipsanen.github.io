import preloadImage from 'image-promise'
import * as React from 'react'
import styled, { keyframes } from 'styled-components'

import { Carousel } from './carousel'
import { Text } from './text'

const CAROUSEL_AUTOPLAY_TIME = 6000
const ANIMATE_BACKGROUND_POSITION = false
const BACKGROUND_POSITION_ANIMATION_RANGE = 10 // [50-this, 50+this]

const HeroCarouselContainer = styled.div`
	width: 100%;
	height: 100vh; /* meh */
`

class _ImageCarousel extends Carousel<HeroCarouselItem> {}
const ImageCarousel = styled(_ImageCarousel)`
	width: 100%;
	height: 100%;
`

const CarouselOverlay = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	height: 100%;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0.4) 0%,
		transparent 25%,
		transparent 75%,
		rgba(0, 0, 0, 0.4) 100%
	);
`

const CarouselImageContainer = styled.div`
	width: 100%;
	height: 100%;
`

// TODO: make this use transform: translate(x, y) to make it smooth. Requires few
// things, for example requires calculating screen/container aspect ratio compared to image aspect ratio
const BackgroundPositionAnimation = keyframes`
  from {
	 background-position: ${50 - BACKGROUND_POSITION_ANIMATION_RANGE}% ${50 +
	BACKGROUND_POSITION_ANIMATION_RANGE}%;
  }

  to {
	  background-position: ${50 + BACKGROUND_POSITION_ANIMATION_RANGE}% ${50 -
	BACKGROUND_POSITION_ANIMATION_RANGE}%;
  }
`

type CarouselImageProps = { src: string }
const CarouselImage = styled.div<CarouselImageProps>`
	background-image: url(${props => props.src});
	background-size: cover;
	background-position: center;
	width: 100%;
	height: 100%;

	will-change: transform;
	${ANIMATE_BACKGROUND_POSITION &&
		`animation: ${BackgroundPositionAnimation} ${CAROUSEL_AUTOPLAY_TIME /
			1000}s
		linear;
	`};
`

const MoreBelowIndicator = styled.div`
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 3px;
	height: 72px;
	background-color: white;
`

const ItemDescriptionText = styled(Text)`
	position: absolute;
	left: 12px;
	bottom: 12px;
	margin: 0px;
`

export type HeroCarouselItem = {
	src: string
	description: string
	year: string
}

type HeroCarouselProps = {
	items: ReadonlyArray<HeroCarouselItem>
}

export const HeroCarousel = ({ items }: HeroCarouselProps) => (
	<HeroCarouselContainer>
		<ImageCarousel
			autoplayTime={CAROUSEL_AUTOPLAY_TIME}
			items={items}
			preload={({ item }) => preloadImage(item.src)}
			render={({ item }) => (
				<CarouselImageContainer>
					<CarouselImage src={item.src} />
					<CarouselOverlay />
					<ItemDescriptionText variant="body" color="white">
						{item.description} <small>({item.year})</small>
					</ItemDescriptionText>
				</CarouselImageContainer>
			)}
		/>
		<MoreBelowIndicator />
	</HeroCarouselContainer>
)
