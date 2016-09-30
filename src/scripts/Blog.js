import { LoadTextAsync, GetUriDirectory } from "./FileHelper.js";
import { Assert, IsEmptyOrWhitespace, IsTouchDevice } from "./MiscHelper.js";
import { Photo } from "./Photo.js";

export class TextBlock {
	constructor(text) {
		this.Text = text;
	}

	get Type() {
		return "Text";
	}
}

export class DayRange {
	constructor(start, end) {
		console.log(start + " " + end)
		Assert(Number.isInteger(start) && Number.isInteger(end) && start <= end && start >= 0 && end >= 0, "Invalid day range");

		this.StartDay = start;
		this.EndDay = end;
	}

	static Parse(str) {
		let splitted = str.split('-');
		Assert(splitted.length == 2, "Invalid string in DayRange.Parse");

		return new DayRange(parseInt(splitted[0]), parseInt(splitted[1]));
	}



	get DisplayString() {
		if(this.IsDayZero) {
			return "Preparations";
		}
		else if(this.StartDay === this.EndDay) {
			return "Day " + this.StartDay;
		}

		return "Day " + this.StartDay + "-" + this.EndDay;
	}

	get IsDayZero() {
		return this.StartDay === 0 && this.EndDay === 0;
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
	constructor(image, isFullWidth) {
		this.Image = image;
		this.IsFullWidth = isFullWidth;
	}

	get Type() {
		return "Image";
	}

	static Parse(folder, str) {
		const parameters = str.split('|');
		Assert(parameters.length > 0);

		const imgParameters = parameters[0].split('?'); // jotain.jpg?1920x1080 for example
		const source = imgParameters[0];
		const resolutionStr = imgParameters[1].split('x');

		const isFullWidth = false;
		var photoText = "";
		if (parameters.length > 1) {
			photoText = parameters[1];
		}
		return new ImageBlock(new Photo(folder, source, photoText, parseInt(resolutionStr[0]), parseInt(resolutionStr[1])), isFullWidth);
	}
}

export class ImageGroupBlock {
	constructor(images) {
		this.Images = images;
	}

	get Type() {
		return "ImageGroup";
	}

	static Parse(folder, str) {
		const params = str.split(' ');

		const images = [];
		for(let i = 0; i < params.length; i++) {
			const imgParams = params[i].split("?");
			Assert(imgParams.length >= 2);
			const resolutionStr = imgParams[1].split("x"); // "3452x2441" for example

			images.push(new Photo(folder, imgParams[0], "", parseInt(resolutionStr[0]), parseInt(resolutionStr[1])));
		}

		return new ImageGroupBlock(images);
	}
}

export class BlogPost{
	constructor(name, title, trip, dayRange, mainImage, contentBlocks) {
		this.Name = name;
		this.Title = title;
		this.Trip = trip; // trip == "Europe '15'". "Spain '14'" etc
		this.DayRange = dayRange;
		this.MainImage= mainImage;
		this.ContentBlocks = contentBlocks;
	}

	get TripUrlString() {
		return this.Trip.replace(" ", "").toLowerCase()
	}

	static async FromFile(name, postFolder) {
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
				Assert(ReadProperty(lines[2]) == "date-range", "Blog post .txt doesn't have 'date-range' tag (or not in the third line)");
				Assert(ReadProperty(lines[3]) == "main-image", "Blog post .txt doesn't have 'main-image' tag (or not in the fourth line)");
				const title = ParseProperty(lines[0]);
				const trip = ParseProperty(lines[1]);
				const dayRange = DayRange.Parse(ParseProperty(lines[2]));
				const mainImage = new Photo(postFolder, ParseProperty(lines[3]));

				let contentBlocks = [];
				for(let i = 4; i < lines.length; i++) {
					if(IsEmptyOrWhitespace(lines[i])) { // skip empty lines
						continue;
					}

					const property = ReadProperty(lines[i]);
					switch(property) {
						case "text":
							contentBlocks.push(new TextBlock(ParseProperty(lines[i])));
							break;
						case "image":
							contentBlocks.push(ImageBlock.Parse(postFolder, ParseProperty(lines[i])));
							break;

						case "image-group":
							contentBlocks.push(ImageGroupBlock.Parse(postFolder, ParseProperty(lines[i])));
							break;

						case "header":
							contentBlocks.push(new HeaderBlock(ParseProperty(lines[i])));
							break;

						default:
							throw Error("Unknown property in blog post: '" + property + "' " + lines[i].charCodeAt(0) + " " + i );
					}
				}

				resolve(new BlogPost(name, title, trip, dayRange, mainImage, contentBlocks));
			}
			catch(err) { reject(err); }
		});
	}
}

class BlogPostInfo {
	constructor(name, title, dayRange, trip, mainImage, directory) {
		this.Name = name;
		this.Title = title;
		this.DayRange = dayRange;
		this.Trip = trip;
		this.MainImage = mainImage;

		this._directory = directory;
	}

	get TripUrlString() {
		return this.Trip.replace(" ", "").toLowerCase()
	}

	get Directory() {
		return this._directory + "/posts/" + this.Name + "/";
	}
}

export class BlogQuery {
	constructor(blogSource, queryFunction) {
		this.PostInfos = blogSource.PostInfos.filter(queryFunction);
		this.Directory = blogSource.Directory;
		this._blogPosts = new Map();
	}

	GetPreviousPostInfo(post) {
		if(post == undefined) {
			return null;
		}

		const index = this.GetIndexByPost(post);
		if(index == 0) {
			return null;
		}

		return this.PostInfos[index - 1];
	}

	GetNextPostInfo(post) {
		if(post == undefined) {
			return null;
		}

		const index = this.GetIndexByPost(post);
		if(index == this.PostInfos.length - 1) {
			return null;
		}

		return this.PostInfos[index + 1];
	}

	GetIndexByPost(post) {
		for(let i = 0; i < this.PostInfos.length; i++) {
			if(this.PostInfos[i].Name == post.Name) {
				return i;
			}
		}

		return -1;
	}

	async GetBlogPostByName(name) {
		const blog = this;
		return new Promise(async (resolve, reject) => {
			try {
				const postPath = blog.Directory + "/posts/" + name + "/";
				if(!blog._blogPosts.has(postPath)) {
					blog._blogPosts.set(postPath, await BlogPost.FromFile(name, postPath));
				}

				resolve(blog._blogPosts.get(postPath));
			}
			catch(err) { reject(err); }
		});
	}

	async GetBlogPostByPostInfo(postInfo) {
		const blog = this;
		return new Promise(async (resolve, reject) => {
			try {
				const post = await blog.GetBlogPostByName(postInfo.Name);
				resolve(post);
			}
			catch(err) { reject(err); }
		});
	}

	async GetBlogPostByIndex(index) {
		Assert(index >= 0 && index < this.PostInfos.length, "Index out of range in GetBlogPostByIndex");
		const blog = this;
		return new Promise(async (resolve, reject) => {
			try {
				const post = await blog.GetBlogPostByName(blog.PostInfos[index].Name);
				resolve(post);
			}
			catch(err) { reject(err); }
		});
	}
}

export class BlogSource {
	constructor(posts, directory) {
		this.PostInfos = posts;
		this.Directory = directory;
	}

	CreateQuery(queryFunction = () => true) {
		return new BlogQuery(this, queryFunction);
	}

	static async FromFile(blogPostListPath, ) {
		return new Promise(async (resolve, reject) => {
			try {
				const text = await LoadTextAsync(blogPostListPath);
				const posts = text.split('\n'); // remove empty lines
				const directory = GetUriDirectory(blogPostListPath);

				let blogPosts = [];
				for(let i = 1; i < posts.length; i++) { // starts from 1 because first line is file format explaining comment
					const parameters = posts[i].split('|');
					const name = parameters[0];
					const trip = parameters[1];
					const title = parameters[2];
					const dayRange = DayRange.Parse(parameters[3]);
					const mainImage = parameters[4];

					blogPosts.push(new BlogPostInfo(name, title, dayRange, trip, mainImage, directory));
				}

				resolve(new BlogSource(blogPosts, directory));
			}
			catch(err) { reject(err); }
		});
	}
}
