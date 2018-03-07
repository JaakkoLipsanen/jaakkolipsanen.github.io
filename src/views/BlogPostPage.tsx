import * as React from 'react';
import styled from 'styled-components';

import history from '../history';
import { BlogPostElement } from '../blog';
import { findBlogPostInfoByName, loadBlogPost, BlogPost } from '../blog';
import aws from '../aws';
import { ImageQuality } from '../common';
import CoverImage from '../components/CoverImage';

const BlogPostPageLayout = styled.div`
	width: 100vw;
	margin: 0;
	position: absolute;
	top: 0;
`;

const BlogContentBackground = styled.div`
	background-color: white;
`;

const BlogContentContainer = styled.div`
	max-width: 1000px;
	padding: 0 24px;
	margin: auto;
	overflow: hidden;
`;

const BlogImageContainer = styled.div`
	width: 100%;
	margin-bottom: 16px;
`;

const BlogImage = styled.img`
	width: 100%;
`;

const BlogImageText = styled.p`
	font-style: italic;
	text-align: center;
	margin: 0;
`;

type BlogContentProps = { elements: BlogPostElement[], blogPostName: string };
const BlogContent = (props: BlogContentProps) => {
	const Element = ({ element }: { element: BlogPostElement }) => {
		switch (element.type) {
			case 'text':
				return <p>{element.text}</p>;
			case 'header':
				return <h4>{element.title}</h4>;
			case 'image':
				return (
					<BlogImageContainer>
						<BlogImage src={aws.getImageUrl(props.blogPostName, ImageQuality.FullHD, element.image.filename)} />
						<BlogImageText>{element.image.imageText}</BlogImageText>
					</BlogImageContainer>
				);
			default:
				return <span style={{ color: 'red' }}>Unrecognized element type: {element.type}</span>;
		}
	};

	return (
		<BlogContentBackground>
			<BlogContentContainer>
				{props.elements.map((element, i) => <Element key={i} element={element} />)}
			</BlogContentContainer>
		</BlogContentBackground>
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
				<CoverImage blogPost={this.state.blogPost} height={'85vh'} />
				<BlogContent blogPostName={this.state.blogPost.name} elements={this.state.blogPost.content} />
			</BlogPostPageLayout>
		);
	}
}

export default BlogPostPage;
