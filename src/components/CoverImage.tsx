import * as React from 'react';
import styled from 'styled-components';
import withProps from 'styled-components-ts';

import aws from '../aws';
import { ImageQuality } from '../common';
import { BlogPost } from '../blog';
import { TakeHeight } from './helpers';

type ImageContainerProps = { height: string };
const ImageContainer = withProps<ImageContainerProps>(styled.div)`
	width: 100%;
	height: ${props => props.height};

	position: fixed;
	z-index: -2;
`;

type ImageProps = { src: string };
const Image = withProps<ImageProps>(styled.div)`
	width: 100%;
	height: 100%;

	background-position: center;
	background-size: cover;
	background-image: url(${props => props.src});
`;

const ImageOverlay = styled.div`
	width: 100%;
	height: 100%;
	box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.5);
	background-color: rgba(0, 0, 0, 0.15);
`;

const ImageTitle = styled.h2`
	color: white;
	height: 100%;
	text-align: center;
	transform: translate(0, 50%);
	margin: 0;
`;

interface CoverImageProps { blogPost: BlogPost; height: string; }
const CoverImage = ({ blogPost, height }: CoverImageProps) => {
	const { title } = blogPost;

	return (
		<>
			<ImageContainer height={height}>
				<Image src={aws.getImageUrl(blogPost.name, ImageQuality.FullHD, blogPost.coverImage)} />
				<ImageOverlay />
				<ImageTitle>{title}</ImageTitle>
			</ImageContainer>
			<TakeHeight height={height} />
		</>
	);
};

export default CoverImage;