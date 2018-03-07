import * as React from 'react';
import styled from 'styled-components';

import history from '../history';
import { BlogPostElement } from '../blog';
import { findBlogPostInfoByName, loadBlogPost, BlogPost } from '../blog';
import CoverImage from '../components/CoverImage';

const BlogPostPageLayout = styled.div`
	width: 100vw;
	margin: 0;
	position: absolute;
	top: 0;
`;

const BlogContentContainer = styled.div`
	background-color: white;
`;

type BlogContentProps = { elements: BlogPostElement[] };
const BlogContent = (props: BlogContentProps) => {
	const Element = ({ element }: { element: BlogPostElement }) => {
		switch (element.type) {
			case 'text':
				return <p>{element.text}</p>;
			case 'header':
				return <p>{element.title}</p>;
			case 'image':
				return <p>{element.image}</p>;

			default:
				return <span style={{ color: 'red' }}>Unrecognized element type: {element.type}</span>;
		}
	};

	return (
		<BlogContentContainer>
			{props.elements.map((element, i) => <Element key={i} element={element} />)}
		</BlogContentContainer>
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
				<BlogContent elements={this.state.blogPost.content} />
			</BlogPostPageLayout>
		);
	}
}

export default BlogPostPage;
