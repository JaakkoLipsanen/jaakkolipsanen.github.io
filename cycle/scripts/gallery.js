var ImageLoadDirection = {
	Current : 0,
	Previous: -1,
	Next: 1,
};

function ImagePreloader() {
	this.IsPreloadCompleted = true;

	var preloadedImage = new Image();
	preloadedImage.onload = function() {
		isPreloadCompleted = true;
	};
	
	this.PreloadImage = function(url) {
		isPreloadCompleted = false;
		preloadedImage.src = url; 
	};
}

function Photo(photoName, description) {
	this.PhotoName = photoName;
	this.Description = description;
}

function Gallery(galleryTitle, containerElement, galleryDescriptionFilePath) {
	this.Photos = LoadGalleryPhotos(galleryDescriptionFilePath);
	this.PhotoCount = this.Photos.length;
		
	var currentImageIndex = 0;
	var preloader = new ImagePreloader();

	var currentImageElementIndex = 0;
	var previousImageIndex = -1;
	
	$(containerElement).append(LoadTextFile("gallery.html"));
	
	var updateImage = function(imageLoadDirection) {	
	
		var newIndex = currentImageIndex + imageLoadDirection;
		if(newIndex < 0 || newIndex >= this.PhotoCount) {
			return;
		}
		
		currentImageIndex = newIndex;
	
		var currentImage = $(containerElement).find(".gallery-image-" + (currentImageElementIndex % 2));
		var previousImage = $(containerElement).find(".gallery-image-" + ((currentImageElementIndex + 1) % 2));
		
		var onImageLoaded = function() {
			$(containerElement).find(".gallery-image-fade").css("opacity", "0");
			currentImage.css("opacity", "1");
			previousImage.css("opacity", "0");
		};
		
		var getPhotoSource = function(photoIndex) {
			return "data/spain14/photos/fullsize/" + this.Photos[photoIndex].PhotoName
		}.bind(this);

		currentImageElementIndex++;
		currentImage.load(function() {
			onImageLoaded();
		});

		var newImageSource = GetAbsolutePath(getPhotoSource(currentImageIndex));
		if(currentImage.attr("src") != newImageSource) {
			currentImage.attr("src", newImageSource);
			
			// if image is not loaded OR the preloading is not completed and the new image is the next one (== the same one as what is being preloaded)
			if(!IsImageLoaded(newImageSource) || (!preloader.IsPreloadCompleted && imageLoadDirection == ImageLoadDirection.Next)) {
				$(containerElement).find(".gallery-image-fade").css("opacity", "0.5");
			}
		}
		else {
			onImageLoaded();
		}
		
		$(containerElement).find(".gallery-current-description").text(this.Photos[currentImageIndex].Description);
		$(containerElement).find(".gallery-current-image-index").text(currentImageIndex + 1);
		
		previousImageIndex = currentImageIndex;
		
		if(currentImageIndex < this.PhotoCount - 1) {
			preloader.PreloadImage(getPhotoSource(currentImageIndex + 1));
		}
		
	}.bind(this);
	
	this.MovePrevious = function() {
		updateImage(ImageLoadDirection.Previous);
	};
	
	this.MoveNext = function() {
		updateImage(ImageLoadDirection.Next);
	};

	var containerStyle = containerElement.style;
	var containerStyleDefaultValues = {
		maxWidth: containerStyle.maxWidth,
		maxHeight: containerStyle.maxHeight,
		width: containerStyle.width,
		height: containerStyle.height,
	};
	
	$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange", function() {	
		if(IsFullScreen()) {
			$(containerElement).find(".gallery-toggle-fullscreen").attr("src", "icons/gallery-reduce.png");
			containerElement.style.maxWidth = "100%";
			containerElement.style.maxHeight = "100%";
			containerElement.style.width = "100%";
			containerElement.style.height = "100%";
		}
		else {
			$(containerElement).find(".gallery-toggle-fullscreen").attr("src", "icons/gallery-expand.png");
			containerElement.style.maxWidth = containerStyleDefaultValues.maxWidth;
			containerElement.style.maxHeight= containerStyleDefaultValues.maxHeight;
			containerElement.style.width = containerStyleDefaultValues.width;
			containerElement.style.height= containerStyleDefaultValues.height;
		}
	}.bind(this));
	
	$(containerElement).find(".gallery-toggle-fullscreen").click(function() {
		if(!IsFullScreen()) {	
			EnterFullScreen(containerElement);
		}
		else {
			ExitFullScreen();
		}
	}.bind(this));
	
	$(containerElement).find(".gallery-previous-button").click(function() {
		this.MovePrevious();
	}.bind(this));
	
	$(containerElement).find(".gallery-next-button").click(function() {
		this.MoveNext();
	}.bind(this));
	
	updateImage(ImageLoadDirection.Current);
	$(containerElement).find(".gallery-total-image-count").text(this.PhotoCount); 
	$(containerElement).find(".gallery-topbar-title").text(galleryTitle);
}

function LoadGalleryPhotos(galleryDescriptionFilePath) {
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
	
	var text = LoadTextFile(galleryDescriptionFilePath);
	var lines = text.split("\n");
	
	var versionString = lines[0];
	var photoCount = parseInt(lines[1]);
	var hasThumbnails = (lines[2] == "1");
	
	var photos = [];
	for(var i = 0, currentIndex = 3; i < photoCount; i++) {
		photos.push(new Photo(lines[currentIndex++], lines[currentIndex++]));
	}
	
	return photos;
}