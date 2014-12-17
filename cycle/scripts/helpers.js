// this function still fails in chrome in local mode. the online version works
function loadXML(filePath) {
	var xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"); // ActiveX == for old IE's			
					
	xhttp.open("GET", filePath, false);
	xhttp.setRequestHeader('Content-Type', 'text/xml');
	xhttp.send();
					
	// xhttp.responseXml does not for some reason work on chrome or IE. so instead, use xhttp.responseText and parse "manually"
	var parser = new DOMParser();
	var xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
	return xmlDoc;
} 

// http://stackoverflow.com/a/7934009
function enterFullScreen(element) {
	var func = element.requestFullScreen || element.mozRequestFullScreen || element.webkitRequestFullScreen;
	func.call(element);
}
			
function exitFullScreen() {
	var func = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
	func.call(document);
}

function isFullScreen() {
	return (document.fullscreenElement && document.fullscreenElement !== null) || document.mozFullScreen || document.webkitIsFullScreen;
}

function addMultiEventListener(events, func) {
	var arr = events.split(" ");
	
	for(var i = 0; i < arr.length; i++) {
		document.addEventListener(arr[i], func, false);
	}
}	

function getAbsolutePath(url) {
    var link = document.createElement("a");
    link.href = url;
    return (link.protocol+"//"+link.host+link.pathname+link.search+link.hash);
}