import { IsTouchDevice } from "./MiscHelper.js";

export const PhotoQuality = {
	Original: "orig", // todo: rename "highest"?
	FullHD: "1080p",
	HD: "720p",
	SD: "480p",
	LD: "480p", // "LowDefinition" todo: 240p images?
};

export class Photo {
	constructor(folder, fileName, text = "", width = -1, height = -1) {
		this.Folder = folder;
		this.FileName = fileName;
		this.Width = width;
		this.Height = height;
		this.Text = text;
	}

	get AspectRatio() {
		return this.Width / this.Height;
	}

	FullPath(photoQuality = PhotoQuality.FullHD) {
		return this.Folder + "/" + photoQuality + "/" + this.FileName;
	}

	get DefaultPath() {
		// default is SD on mobile devices and 1080p on desktop
		return IsTouchDevice() ? this.FullPath(PhotoQuality.SD) : this.FullPath(PhotoQuality.FullHD);
	}

	get DefaultHDPath() {
		// default "HD" is 720p on mobile devices and 1080p on desktop
		return IsTouchDevice() ? this.FullPath(PhotoQuality.SD) : this.FullPath(PhotoQuality.FullHD);
	}

	get IsPortrait() {
		return this.AspectRatio < 1;
	}
}
// /cycle/blog/posts/usa-16/1080p/img1.jpg 1920w, /cycle/blog/posts/usa-16/1080p/img2.jpg 720w
