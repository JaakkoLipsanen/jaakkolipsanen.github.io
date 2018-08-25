import * as React from 'react'
import styled from 'styled-components'
import withProps from 'styled-components-ts'

import { aws } from '../aws'
import { BlogPost } from '../blog'
import { formatDateRange, ImageQuality } from '../common'
import { TakeHeight } from './helpers'

type ImageContainerProps = { height: string }
const ImageContainer = withProps<ImageContainerProps>(styled.div)`
	width: 100%;
	height: ${props => props.height};

	position: fixed;
	z-index: -2;
`

type ImageProps = { src: string }
const Image = withProps<ImageProps>(styled.div)`
	width: 100%;
	height: 100%;

	background-position: center;
	background-size: cover;
	background-image: url(${props => props.src});
`

const ImageOverlay = styled.div`
	width: 100%;
	height: 100%;
	box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.5);
	background-color: rgba(0, 0, 0, 0.15);

	position: absolute;
	top: 0;
`

const ImageTitle = styled.h2`
	position: absolute;
	top: 0;

	width: 100%;
	height: 100%;
	transform: translate(0, 50%);
	text-align: center;
	margin: 0;

	color: #f9f9f9;
	font-size: 34px;
	font-weight: 300;
	text-shadow: 1px 1px #000;
`

const ImageSubtextContainer = styled.div`
	position: absolute;
	top: 0;

	width: 100%;
	height: 85vh;
	padding-bottom: 22px;
	box-sizing: border-box;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;

	color: #f1f1f1;
`

const ImageSubtextItem = styled.p`
	font-size: 24px;
	font-weight: 300;
	font-style: italic;
	margin: 2px;
`

interface CoverImageProps {
	blogPost: BlogPost
	height: string
}

export const CoverImage = ({ blogPost, height }: CoverImageProps) => {
	const { title } = blogPost

	return (
		<>
			<ImageContainer height={height}>
				<Image
					src={aws.getImageUrl(
						blogPost.name,
						ImageQuality.FullHD,
						blogPost.coverImage
					)}
				/>
				<ImageOverlay />
				<ImageTitle>{title.toUpperCase()}</ImageTitle>
				<ImageSubtextContainer>
					<ImageSubtextItem>
						{formatDateRange(blogPost.dateRange)}
					</ImageSubtextItem>
					<ImageSubtextItem>{blogPost.trip}</ImageSubtextItem>
				</ImageSubtextContainer>
			</ImageContainer>
			<TakeHeight height={height} />
		</>
	)
}
