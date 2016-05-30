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
		return IsTouchDevice() ? this.FullPath(PhotoQuality.HD) : this.FullPath(PhotoQuality.FullHD);
	}

	get MultiPath() {
		// yeah.. I want to load low res images on mobile always. The screens are so small that 480p is well enogh. and users can click image to view it high res
		// I think this might also trigger on touchscreen laptops and desktops but... meh, what can you do about it?
		if(IsTouchDevice()) {
			return this.FullPath(PhotoQuality.SD) + " 640w";
		}

		function CalculateWidth(desiredHeight, sourceWidth, sourceHeight) {
			if(sourceWidth === -1 || sourceHeight === -1) {
				sourceWidth = 1920; // 4 : 3 aspect ratio
				sourceHeight = 1440;
			}

			return Math.round(desiredHeight * sourceWidth / sourceHeight) + "w";
		}

		let paths = [
			this.FullPath(PhotoQuality.SD) + " " + CalculateWidth(480, this.Width, this.Height),
			this.FullPath(PhotoQuality.HD) + " " + CalculateWidth(640, this.Width, this.Height),
			this.FullPath(PhotoQuality.FullHD) + " " + CalculateWidth(1080, this.Width, this.Height),
		];

		return paths.join();
	}

	get IsPortrait() {
		return this.AspectRatio < 1;
	}
}
// /cycle/blog/posts/usa-16/1080p/img1.jpg 1920w, /cycle/blog/posts/usa-16/1080p/img2.jpg 720w
