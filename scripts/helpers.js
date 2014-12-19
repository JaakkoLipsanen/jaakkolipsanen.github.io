// this function still fails in chrome in local mode. the online version works
function LoadXML(filePath) {
	var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); // ActiveX == for old IE's			
					
	xhttp.open("GET", filePath, false);
	xhttp.setRequestHeader('Content-Type', 'text/xml');
	xhttp.send();
					
	// xhttp.responseXml does not for some reason work on chrome or IE. so instead, use xhttp.responseText and parse "manually"
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
	return xmlDoc;
} 

function LoadAsyncXML(filePath, callback) {
	var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); // ActiveX == for old IE's			
					
	xhttp.open("GET", filePath, true);
	xhttp.setRequestHeader('Content-Type', 'text/xml');
	
	xhttp.onload = function(e) {
		// xhttp.responseXml does not for some reason work on chrome or IE. so instead, use xhttp.responseText and parse "manually"
		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
		callback(xmlDoc);
	};
	
	xhttp.send();
} 

// this function still fails in chrome in local mode. the online version works
function LoadTextFile(filePath) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", filePath, false);
	xhttp.overrideMimeType('text/plain');
	xhttp.send();
	
	return xhttp.responseText;
} 

// this function still fails in chrome in local mode. the online version works
function LoadAsyncText(filePath, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", filePath, true);
	xhttp.overrideMimeType('text/plain');
	
	xhttp.onload = function(e) {
		callback(xhttp.responseText);
	};
	
	xhttp.send();
} 

// http://stackoverflow.com/a/7934009
function EnterFullScreen(element) {
	var func = element.requestFullScreen || element.mozRequestFullScreen || element.webkitRequestFullScreen;
	func.call(element);
}
			
function ExitFullScreen() {
	var func = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
	func.call(document);
}

function IsFullScreen() {
	return (document.fullscreenElement && document.fullscreenElement !== null) || document.mozFullScreen || document.webkitIsFullScreen;
}

function addMultiEventListener(events, func) {
	var arr = events.split(" ");
	
	for(var i = 0; i < arr.length; i++) {
		document.addEventListener(arr[i], func, false);
	}
}	

function GetAbsolutePath(url) {
    var link = document.createElement("a");
    link.href = url;
    return (link.protocol+"//"+link.host+link.pathname+link.search+link.hash);
}

// http://stackoverflow.com/a/1420902
function GetRootPath() {
	var pathArray = window.location.href.split( '/' );
	var protocol = pathArray[0];
	var host = pathArray[2];
	return protocol + '//' + host;
}

// http://stackoverflow.com/a/7847366
function IsImageLoaded(url) { 
	var test = document.createElement("img");
	test.src = url;
	return test.complete || test.width + test.height > 0;
};

// $(selector).exists()
jQuery.fn.exists = function(){
	return this.length > 0;
}