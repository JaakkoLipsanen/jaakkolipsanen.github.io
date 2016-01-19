import { LoadTextAsync, GetUriDirectory } from "./FileHelper.js"

export const PhotoType = {
	Thumbnail : "thumbnails",
	Mid : "1080p",
	Fullsize: "fullsize"
};

export class Photo {
	constructor(photoName, description) {
		this.PhotoName = photoName;
		this.Description = description;
	}
}

export class GallerySource {
	constructor(folder, photos) {
		this.Folder = folder;
		this.Photos = photos;
	}

	get PhotoCount() {
		return this.Photos.length;
	}

	GetPath(photo, photoType) {
		return this.Folder + photoType + "/" + photo.PhotoName;
	}

	static async FromFile(galleryFolder) {
		/*
		* File Format:
		*
		* Line 1. Version string ( eg. "v0.1" )
		* Line 2. Photo Count (eg. "123" )
		* Line 3. Are thumbnails generated (eg. "1" )
		* Line 4-end. <Photo Count> x photo format
		*
		*
		* Photo Format:
		*
		* Line 1. Photo name
		* Line 2. Photo description
		*
		* */

		return new Promise(async function(resolve, reject) {
			try {
				const galleryDescriptionPath = galleryFolder + "/gallery-description.txt";
				const text = await LoadTextAsync(galleryDescriptionPath);
				const lines = text.split("\n");

				const versionString = lines[0];
				const photoCount = parseInt(lines[1]);
				const hasThumbnails = (lines[2] == "1");

				let photos = [];
				for(let i = 0, currentIndex = 3; i < photoCount; i++) {
					photos.push(new Photo(lines[currentIndex++], lines[currentIndex++]));
				}

				console.log("xxx");
				resolve(new GallerySource(GetUriDirectory(galleryDescriptionPath), photos));
			}
			catch(err) { reject(err); }
		});
	}
}

export class Gallery {
	constructor() {
		this.CurrentSource = null;
	}

	SetSource(routeItem) {
		console.log("SET " + routeItem.gallerySource.Photos.length);
		this.CurrentSource = routeItem.gallerySource;
	}

	get PhotoCount() {
		if(this.CurrentSource == null) {
			return 0;
		}

		return this.CurrentSource.PhotoCount;
	}


	GetNext(photo) {

	}


	async PreloadGalleries(routes) {
		for(let routeItem of routes) {
			if(routeItem.gallerySource == null) {
				routeItem.gallerySource = await GallerySource.FromFile(routeItem.gallery);
			}
		}
	}
}
