import * as React from 'react'
import styled from 'styled-components'

import { Carousel } from './carousel'

const HeroCarouselContainer = styled.div`
	width: 100%;
	height: 100vh;
`

class _ImageCarousel extends Carousel<HeroCarouselItem> {}
const ImageCarousel = styled(_ImageCarousel)`
	width: 100%;
	height: 100vh;
`

const CarouselOverlay = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	height: 100vh;
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

type CarouselImageProps = { src: string }
const CarouselImage = styled.div<CarouselImageProps>`
	background-image: url(${props => props.src});
	background-size: cover;
	background-position: center;
	width: 100%;
	height: 100%;
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
			items={items}
			render={({ item }) => (
				<CarouselImageContainer>
					<CarouselImage src={item.src} />
					<CarouselOverlay />
					<p
						style={{
							position: 'absolute',
							left: '12px',
							bottom: '12px',
							margin: '0px',
							color: 'white'
						}}
					>
						{item.description} <small>({item.year})</small>
					</p>
				</CarouselImageContainer>
			)}
		/>
		<MoreBelowIndicator />
	</HeroCarouselContainer>
)
