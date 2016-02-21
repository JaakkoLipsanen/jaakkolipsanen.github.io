import { LoadTextAsync, GetUriDirectory } from "./FileHelper.js";
import { Assert, IsEmptyOrWhitespace } from "./MiscHelper.js";

export const BlockType = {
	Text: 0,
	Image: 1,
};

export class TextBlock {
	constructor(text) {
		this.Text = text;
	}

	get Type() {
		return "Text";
	}
}

export class HeaderBlock {
	constructor(title) {
		this.Title = title;
	}

	get Type() {
		return "Header";
	}
}

export class ImageBlock {
	constructor(source, isFullWidth) {
		this.Source = source.trim();
		this.IsFullWidth = isFullWidth;
	}

	get Type() {
		return "Image";
	}

	static Parse(str) {
		const parameters = str.split(' ');
		Assert(parameters.length > 0);

		const source = parameters[0];
		const isFullWidth = parameters.indexOf("fullwidth") >= 0;
		console.log(parameters)
		return new ImageBlock(source, isFullWidth);
	}
}

export class BlogPost{
	constructor(title, trip, dateRange, contentBlocks, directory) {
		this.Title = title;
		this.Trip = trip; // trip == "Europe '15'". "Spain '14'" etc
		this.DateRange = dateRange;
		this.ContentBlocks = contentBlocks;

		this.Directory = directory;
		this.MainImageSource = contentBlocks.filter(x => x instanceof ImageBlock)[0].Source;
	}

	static async FromFile(postFolder) {
		return new Promise(async (resolve, reject) => {
			try {
				const path = postFolder + "/post.txt";
				const text = await LoadTextAsync(path);
				const lines = text.split('\n').filter(x => x != ""); // remove empty lines

				function ReadProperty(text) {
					const property = text.split(":", 2)[0];
					return property;
				}

				function ParseProperty(text) {
					const propertyValue = text.substr(text.indexOf(":") + 1).trim();
					return propertyValue;
				}

				Assert(lines.length > 0, "Blog post doesn't have content");
				Assert(ReadProperty(lines[0]) == "title", "Blog post .txt doesn't start with 'title'"); // 'title' property must be on the first line
				Assert(ReadProperty(lines[1]) == "trip", "Blog post .txt doesn't have 'trip' tag (or not in the second line)");
				let title = ParseProperty(lines[0]);
				let trip = ParseProperty(lines[1]);

				let contentBlocks = [];
				for(let i = 2; i < lines.length; i++) {
					if(IsEmptyOrWhitespace(lines[i])) { // skip empty lines
						continue;
					}

					const property = ReadProperty(lines[i]);
					switch(property) {
						case "text":
							contentBlocks.push(new TextBlock(ParseProperty(lines[i])));
							break;
						case "image":
							contentBlocks.push(ImageBlock.Parse(ParseProperty(lines[i])));
							break;

						case "header":
							contentBlocks.push(new HeaderBlock(ParseProperty(lines[i])));
							break;

						default:
							throw Error("Unknown property in blog post: '" + property + "' " + lines[i].charCodeAt(0) + " " + i );
					}
				}

				resolve(new BlogPost(title, trip, "", contentBlocks, postFolder));
			}
			catch(err) { reject(err); }
		});
	}
}

export class BlogList {
	constructor(posts, directory) {
		this.Posts = posts;
		this.Directory = directory;
		this._blogPosts = new Map();
	}

	GetIndex(post) {
		return this.Posts.indexOf(post);
	}

	async GetBlogPostByIndex(index) {
		Assert(index >= 0 && index < this.Posts.length, "Index out of range in GetBlogPostByIndex");

		return new Promise(async (resolve, reject) => {
			try {
				resolve(await GetBlogPostByPath(this.Posts[index]));
			}
			catch(err) { reject(err); }
		});
	}

	async GetBlogPostByName(entryName) {
		const blog = this;
		return new Promise(async (resolve, reject) => {
			try {
				const postPath = blog.Directory + "/posts/" + entryName + "/";
				if(!blog._blogPosts.has(postPath)) {
					blog._blogPosts.set(postPath, await BlogPost.FromFile(postPath));
				}

				resolve(blog._blogPosts.get(postPath));
			}
			catch(err) { reject(err); }
		});
	}

	static async FromFile(blogPostListPath) {
		return new Promise(async (resolve, reject) => {
			try {
				const text = await LoadTextAsync(blogPostListPath);
				const posts = text.split('\n'); // remove empty lines

				resolve(new BlogList(posts, GetUriDirectory(blogPostListPath)));
			}
			catch(err) { reject(err); }
		});
	}
}
