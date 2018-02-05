import * as React from 'react';
import styled from 'styled-components';
import withProps from 'styled-components-ts';

import aws from '../aws';
import history from '../history';
import { ImageQuality } from '../common';
import { findBlogPostInfoByName, loadBlogPost, BlogPost } from '../blog';

const BlogPostPageLayout = styled.div`
	width: 100vw;
	margin: 0;
`;

type CoverImageContainerProps = { src: string };
const CoverImageContainer = withProps<CoverImageContainerProps>(styled.div)`
	width: 100%;
	height: 85vh;

	position: fixed;
	top: 0;
	z-index: -1;

	background-position: center;
	background-size: cover;
	background-image: url(${props => props.src });
`;

const CoverImageTitle = styled.h2`
	color: white;
	height: 100%;
	text-align: center;
	transform: translate(0, 50%);
	margin: 0;
`;

const CoverImage = (props: { blogPost: BlogPost }) => {
	const blogPost = props.blogPost;
	const { title } = blogPost;

	return (
		<CoverImageContainer src={aws.getImageUrl(blogPost.name, ImageQuality.FullHD, blogPost.coverImage)}>
			<CoverImageTitle>{title}</CoverImageTitle>
		</CoverImageContainer>
	);
};

interface BlogPostPageProps { name: string; }
interface BlogPostPageState { blogPost: BlogPost | null; }
class BlogPostPage extends React.Component<BlogPostPageProps, BlogPostPageState> {
	state: BlogPostPageState = {
		blogPost: null
	};

	async componentDidMount() {
		const blogPostInfo = findBlogPostInfoByName(this.props.name);
		if (!blogPostInfo) {
			return history.push('/404');
		}

		this.setState({ blogPost: await loadBlogPost(blogPostInfo) });
	}

	render() {
		if (!this.state.blogPost) {
			return null;
		}

		return (
			<BlogPostPageLayout>
				<CoverImage blogPost={this.state.blogPost} />
			</BlogPostPageLayout>
		);
	}
}

export default BlogPostPage;
