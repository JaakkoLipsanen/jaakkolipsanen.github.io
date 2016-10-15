
import { BlogPost, ImageBlock, ImageGroupBlock } from "./Blog.js";

export class PhotoStream {
	constructor(photos) {
		this.Photos = photos;
	}

	get Count() {
		return this.Photos.length;
	}

	IndexOf(photo) {
		return this.Photos.indexOf(photo);
	}

	/* this probably should be in Blog.js, but it's pretty long already so lets just put this here */
	static FromBlogPost(blogPost) {

		let photos = [];
		for(const contentBlock of blogPost.ContentBlocks) {
			if(contentBlock instanceof ImageBlock) {
				photos.push(contentBlock.Image);
			}
			else if(contentBlock instanceof ImageGroupBlock) {
				photos = photos.concat(contentBlock.Images);
			}
		}

		return new PhotoStream(photos);
	}
}
