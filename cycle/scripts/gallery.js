function Photo(photoName, description) {
	this.PhotoName = photoName;
	this.Description = description;
}

function Gallery(galleryDescriptionFilePath) {
	this.Photos = [];
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", galleryDescriptionFilePath, false);
	xhttp.overrideMimeType('text/plain');
	xhttp.send();
	
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
     * 
     * */
	
	var lines = xhttp.responseText.split("\n");
	
	var versionString = lines[0];
	var photoCount = parseInt(lines[1]);
	var hasThumbnails = (lines[2] == "1");
	
	for(var i = 0, currentIndex = 3; i < photoCount; i++) {
		this.Photos.push(new Photo(lines[currentIndex++], lines[currentIndex++]));
	}
	
	var getImageSource = function(index) {
		return "data/spain14/photos/fullsize/" + this.Photos[index].PhotoName
	}.bind(this);
	
	var preloadedImage = new Image();
	var preloadNextImage = function() {
		if(currentIndex < this.Photos.length - 1) {
			preloadedImage.src = getImageSource(currentIndex + 1); 
		}
	}.bind(this);
		
	var currentIndex = 0;
	var updateImage = function() {
		document.getElementById("gallery-current-image").src = getImageSource(currentIndex);
		document.getElementById("current-image-index-label").innerHTML = currentIndex + 1; 
		
		preloadNextImage();
	}.bind(this);
	
	
	this.MovePrevious = function() {
		if(currentIndex != 0) {
			currentIndex--;
			updateImage();
		}
	};
	
	this.MoveNext = function() {
		if(currentIndex != this.Photos.length - 1) {
			currentIndex++;
			updateImage();
		}
	};

	var nonFullScreenMaxWidth = "";
	var nonFullScreenMaxHeight = "";
	document.getElementById("gallery-toggle-fullscreen").onclick = function() {
	
		var galleryDiv = document.getElementById("gallery-div");
		if(!isFullScreen()) {	
			nonFullScreenMaxWidth = galleryDiv.style.maxWidth;
			nonFullScreenMaxHeight = galleryDiv.style.maxHeight;
			
			enterFullScreen(galleryDiv);
			document.getElementById("gallery-toggle-fullscreen").src = isFullScreen() ? 
				"icons/gallery-expand.png" : 
				"icons/gallery-reduce.png";
				
			if(isFullScreen()) {
				galleryDiv.style.maxWidth = "100%";
				galleryDiv.style.maxHeight = "100%";
			}
			
		}
		else {
			exitFullScreen();
			document.getElementById("gallery-toggle-fullscreen").src = isFullScreen() ? 
				"icons/gallery-reduce.png" : 
				"icons/gallery-expand.png";
				
			galleryDiv.style.maxWidth = nonFullScreenMaxWidth;
			galleryDiv.style.maxHeight = nonFullScreenMaxHeight;
		}
	}.bind(this);
	
	document.getElementById("previous-image").onclick = function() {
		this.MovePrevious();
	}.bind(this);
	
	document.getElementById("next-image").onclick = function() {
		this.MoveNext();
	}.bind(this);
	
	document.getElementById("total-image-count-label").innerHTML = photoCount; 
}