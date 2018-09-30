import { aws } from '../aws'
import { DateRange, loadText, parseSize, Size } from '../common'

export interface BlogPostInfo {
	name: string
	trip: string
	title: string
	dateRange: DateRange
	coverImage: string
}

export interface Image {
	filename: string
	resolution: Size
	imageText: string
}

interface TextElement {
	type: 'text'
	text: string
}

interface HeaderElement {
	type: 'header'
	title: string
}

interface ImageElement {
	type: 'image'
	image: Image
}

interface ImageGroupElement {
	type: 'image-group'
	images: Image[]
}

export type BlogPostElement =
	| TextElement
	| HeaderElement
	| ImageElement
	| ImageGroupElement

export interface BlogPost {
	name: string
	trip: string
	title: string
	dateRange: DateRange
	coverImage: string
	content: BlogPostElement[]
}

const parseBlogPostList = (blogPostListText: string) => {
	const lines = blogPostListText
		.split('\n')
		.map(line => line.trim())
		.filter(line => !line.startsWith('//') && line.length !== 0)

	return lines.map(line => {
		const [name, trip, title, dateRangeStr, coverImage] = line.split('|')
		const [start, end] = dateRangeStr.split('-')

		const blogPostInfo: BlogPostInfo = {
			coverImage,
			name,
			title,
			trip,
			dateRange: { start: parseInt(start, 10), end: parseInt(end, 10) }
		}

		return blogPostInfo
	})
}

// <image_filename>?<width>x<height>|<optional image text>
const parseImageTagValue = (value: string): Image => {
	const [filename, rest] = value.split('?')
	const [resolutionStr, imageText] = rest.split('|')
	return { filename, imageText, resolution: parseSize(resolutionStr) }
}

const parseElement = (tag: string, value: string): BlogPostElement | null => {
	switch (tag) {
		case 'text':
			return { type: 'text', text: value }
		case 'header':
			return { type: 'header', title: value }
		case 'image':
			return { type: 'image', image: parseImageTagValue(value) }
		case 'image-group':
			return {
				type: 'image-group',
				images: value.split(' ').map(parseImageTagValue)
			}

		default:
			console.error('Unrecognized element in blog post', tag, value)
			return null
	}
}

const parseBlogPost = (name: string, blogPostText: string): BlogPost => {
	const lines = blogPostText
		.split('\n')
		.map(line => line.trim())
		.filter(line => !line.startsWith('//') && line.length !== 0)

	const readTag = (line: string) => line.substr(0, line.indexOf(':')).trim()
	const parseTag = (line: string) => line.substr(line.indexOf(':') + 1).trim()

	const title = parseTag(lines[0])
	const trip = parseTag(lines[1])
	const dateRangeStr = parseTag(lines[2])
	const coverImage = parseTag(lines[3])

	const elements = lines.slice(4).map(line => {
		const tag = readTag(line)
		const value = parseTag(line)

		const element = parseElement(tag, value)
		if (!element) {
			const invalidElement: TextElement = {
				type: 'text',
				text: `<Invalid element in blog post ${tag}: ${value}`
			}

			return invalidElement
		}

		return element
	})

	const [dateStart, dateEnd] = dateRangeStr.split('-')
	return {
		name,
		title,
		trip,
		dateRange: { start: parseInt(dateStart, 10), end: parseInt(dateEnd, 10) },
		coverImage,
		content: elements
	}
}

export const fetchBlogPostInfos = async () => {
	const blogPostListText = await loadText(aws.blogPostsListUrl)
	return parseBlogPostList(blogPostListText)
}

export const fetchBlogPost = async (name: string) => {
	const blogPostText = await loadText(aws.getBlogPostUrl(name))
	return parseBlogPost(name, blogPostText)
}
