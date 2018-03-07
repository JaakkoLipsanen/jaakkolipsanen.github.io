import aws from './aws';
import { DateRange, Size, parseSize } from './common';

export interface BlogPostInfo { 
	name: string;
	trip: string;
	title: string;
	dateRange: DateRange;
	coverImage: string;
}

export interface Image {
	filename: string;
	resolution: Size;
	imageText: string;
}

interface TextElement { type: 'text'; text: string; }
interface HeaderElement { type: 'header'; title: string; }
interface ImageElement { type: 'image'; image: Image; }
interface ImageGroupElement { type: 'image-group'; images: string[]; }
export type BlogPostElement = TextElement | HeaderElement | ImageElement | ImageGroupElement;

export interface BlogPost {
	name: string;
	trip: string;
	title: string;
	dateRange: DateRange;
	coverImage: string;
	content: BlogPostElement[];
}

let blogPostInfos: ReadonlyArray<Readonly<BlogPostInfo>> = [];
const loadText = async (url: string) => {
	const response = await fetch(url);
	return await response.text();
};

const parseBlogPostList = (blogPostListText: string) => {
	const lines = blogPostListText.split('\n')
		.map(line => line.trim())
		.filter(line => !line.startsWith('//') && line.length !== 0);

	return lines.map(line => {
		const [name, trip, title, dateRangeStr, coverImage] = line.split('|');
		const [start, end] = dateRangeStr.split('-');

		return { name, trip, title, dateRange: { start: parseInt(start, 10), end: parseInt(end, 10) }, coverImage };
	});
};

// <image_filename>?<width>x<height>|<optional image text>
const parseImageTagValue = (value: string): Image => {
	const [filename, rest] = value.split('?');
	const [resolutionStr, imageText] = rest.split('|');
	return { filename, imageText, resolution: parseSize(resolutionStr) };	
};

const parseElement = (tag: string, value: string): BlogPostElement | null  => {
	switch (tag) {
		case 'text': return <TextElement> { type: 'text', text: value };
		case 'header': return <HeaderElement> { type: 'header',  title: value };
		case 'image': return <ImageElement> { type: 'image', image: parseImageTagValue(value) };
		case 'image-group': return <ImageGroupElement> { type: 'image-group',  images: value.split(' ') };

		default: console.error('Unrecognized element in blog post', tag, value); return null;
	}
};

const parseBlogPost = (name: string, blogPostText: string): BlogPost => {
	const lines = blogPostText.split('\n')
		.map(line => line.trim())
		.filter(line => !line.startsWith('//') && line.length !== 0);

	const readTag = (line: string) => line.substr(0, line.indexOf(':')).trim();
	const parseTag = (line: string) => line.substr(line.indexOf(':') + 1).trim();
	
	const title = parseTag(lines[0]);
	const trip = parseTag(lines[1]);
	const dateRangeStr = parseTag(lines[2]);
	const coverImage = parseTag(lines[3]);

	const elements = lines.slice(4).map(line => {
		const tag = readTag(line);
		const value = parseTag(line);

		const element = parseElement(tag, value);
		if (!element) {
			return <TextElement> { type: 'text', text: `<Invalid element in blog post ${tag}: ${value}` };
		}

		return element;
	});

	const [dateStart, dateEnd] = dateRangeStr.split('-');
	return { 
		name, 
		title, 
		trip, 
		dateRange: { start: parseInt(dateStart, 10), end: parseInt(dateEnd, 10) }, 
		coverImage, 
		content: elements
	};
};

export const initialize = async () => {
	const blogPostListText = await loadText(aws.blogPostsListUrl);
	blogPostInfos = parseBlogPostList(blogPostListText);
};

export const getBlogPostInfos = () => {
	return blogPostInfos.slice();
};

export const findBlogPostInfoByName = (name: string) => {
	return blogPostInfos.find(post => post.name === name);
};

export const loadBlogPost = async (blogPostInfo: BlogPostInfo) => {
	const blogPostText = await loadText(aws.getBlogPostUrl(blogPostInfo.name));
	return <Readonly<BlogPost>> parseBlogPost(blogPostInfo.name, blogPostText);
};