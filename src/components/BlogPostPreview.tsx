import * as React from 'react';
import styled from 'styled-components';
import withProps from 'styled-components-ts';
import aws from '../aws';

import { BlogPostInfo } from '../blog';
import { ImageQuality, formatDateRange } from '../common';

import Link from './Link';

const PreviewImageOverlay = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	padding-bottom: 66%;

	background-color: rgba(0, 0, 0, 0.25);
	transition: background-color 0.3s;
`;

const PreviewLinkContainer = styled(Link)`
	position: relative;
	display: block;
	margin: 16px 0;

	color: black;
	cursor: pointer;
	text-decoration: none;

	&:hover {
		${PreviewImageOverlay} {
			background-color: transparent;
		}
	}
`;

type PreviewImageProps = { src: string };
const PreviewImage = withProps<PreviewImageProps>(styled.div)`
	width: 100%;
	padding-bottom: 66%;

	background-position: center;
	background-size: cover;
	background-image: url(${props => props.src });
`;

const PreviewTitle = styled.h4`
	width: 100%;
	margin: 0;
	margin-top: 3px;
`;

const PreviewDescription = styled.p`
	width: 100%;
	margin: 0;

	font-weight: 500;
`;

const BlogPostPreview = (props: { blogPostInfo: BlogPostInfo }) => {
	const { name, title, trip, coverImage, dateRange } = props.blogPostInfo;
	return (
		<PreviewLinkContainer href={`/blog/${name}`}>
			<PreviewImage src={aws.getImageUrl(name, ImageQuality.HD, coverImage)} />
			<PreviewImageOverlay />

			<PreviewTitle>{title}</PreviewTitle>
			<PreviewDescription>{trip}: {formatDateRange(dateRange)}</PreviewDescription>
		</PreviewLinkContainer>
	);
};

export default BlogPostPreview;