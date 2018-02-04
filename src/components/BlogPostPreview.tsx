import * as React from 'react';
import styled from 'styled-components';
import withProps from 'styled-components-ts';
import aws from '../aws';

import { BlogPostInfo } from '../blog';
import { ImageQuality, formatDateRange } from '../common';

import Link from './Link';

const BlogPostPreviewImageOverlay = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	padding-bottom: 66%;

	background-color: rgba(0, 0, 0, 0.25);
	transition: background-color 0.3s;
`;

const BlogPostPreviewLinkContainer = styled(Link)`
	position: relative;
	display: block;
	margin: 16px 0;

	color: black;
	cursor: pointer;
	text-decoration: none;

	&:hover {
		${BlogPostPreviewImageOverlay} {
			background-color: transparent;
		}
	}
`;

type BlogPostPreviewImageProps = { src: string };
const BlogPostPreviewImage = withProps<BlogPostPreviewImageProps>(styled.div)`
	width: 100%;
	padding-bottom: 66%;

	background-position: center;
	background-size: cover;
	background-image: url(${props => props.src });
`;

const BlogPostPreviewTitle = styled.h4`
	width: 100%;
	margin: 0;
	margin-top: 3px;
`;

const BlogPostPreviewDescription = styled.p`
	width: 100%;
	margin: 0;

	font-weight: 500;
`;

const BlogPostPreview = (props: { blogPostInfo: BlogPostInfo }) => {
	const { name, title, trip, coverImage, dateRange } = props.blogPostInfo;
	return (
		<BlogPostPreviewLinkContainer href={`/blog/${name}`}>
			<BlogPostPreviewImage src={aws.getImageUrl(name, ImageQuality.HD, coverImage)} />
			<BlogPostPreviewImageOverlay />

			<BlogPostPreviewTitle>{title}</BlogPostPreviewTitle>
			<BlogPostPreviewDescription>{trip}: {formatDateRange(dateRange)}</BlogPostPreviewDescription>
		</BlogPostPreviewLinkContainer>
	);
};

export default BlogPostPreview;