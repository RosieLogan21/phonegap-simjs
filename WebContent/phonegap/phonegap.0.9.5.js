/**
 * Load a JavaScript file after page has loaded.
 *
 * @param {String} jsfile               The url of the JavaScript file to load.
 * @param {Function} successCallback    The callback to call when the file has been loaded.
 */
var _pg_sim_loadJavascript = function(jsfile, successCallback) {
	console.log("loadJavascript("+jsfile+")");
    var id = document.getElementsByTagName("head")[0];         
    var el = document.createElement('script');
    el.type = 'text/javascript';
    if (typeof successCallback === 'function') {
        el.onload = successCallback;
    }
    el.src = jsfile;
    id.appendChild(el);
};

// When DOM content is loaded, delay window.onload until all of the PhoneGap JS files are loaded.
var _pg_sim_window_onload = null;
document.addEventListener('DOMContentLoaded', function() {
	_pg_sim_window_onload = window.onload;
	window.onload = function() {
		console.log("Intercepted window.onload and deferring until PhoneGap is ready");
	};
}, false);

// Determine base URL for PhoneGap JS files
var _pg_sim_phonegapDir = '';
var lists = document.getElementsByTagName("script");
for (var i = 0; i < lists.length; i++) {
  console.log("script tag="+lists[i].src);
  var src = ""+lists[i].src;
  var p = src.indexOf("phonegap.0.9.5.js");
  if (p > 0) {
	  _pg_sim_phonegapDir = src.substring(0, p);
      break;
  }
}
console.log("PhoneGap is loaded from "+_pg_sim_phonegapDir);

//Load all PhoneGap JS files
var _pg_sim_jsfiles = ["phonegap.js.base",
               "accelerometer.js",
               "app.js",
               "camera.js",
               "capture.js",
               "compass.js",
               "contact.js",
               "crypto.js",
               "device.js",
               "file.js",
               "filetransfer.js",
               "geolocation.js",
               "media.js",
               "network.js",
               "notification.js",
               "position.js",
               "storage.js"];

var _pg_sim_jsindex = 0;
function _pg_sim_loadjsfiles() {
	console.log("_pg_sim_loadjsfiles("+_pg_sim_jsindex+")");
	if (_pg_sim_jsindex < _pg_sim_jsfiles.length) {
		_pg_sim_loadJavascript(_pg_sim_phonegapDir+_pg_sim_jsfiles[_pg_sim_jsindex++], _pg_sim_loadjsfiles);
	}
	else {
		console.log("All PhoneGap files are loaded");
		PhoneGap.onDOMContentLoaded.fire();
		PhoneGap.onNativeReady.fire();
		
		console.log("Calling user's window.onload");
		_pg_sim_window_onload();
	}
}
_pg_sim_loadjsfiles();


/**
 * Show popup
 * 
 * @param title		The title of the popup
 * @param content	The content of the popup
 */
function showPopUp(title, content) {
	var div = _pg_sim_div;
	if (!div) {
		div = document.createElement('div');
		div.innerHTML = '';
		div.style.color = "white";
		div.style.position = "absolute";
		div.style.left = (window.innerWidth / 2 - 200) + "px";
		div.style.top = "100px";
		div.style.width = "400px";
		div.style.height = "300px";
		div.style.background = "gray";
		div.style.border = "2px solid white";
		div.style.visibility = "hidden";
		//div.onclick = function() {
		//	this.style.visibility = "hidden";
		//};
		document.body.appendChild(div);
		_pg_sim_div = div;
	}

	div.innerHTML = "<div style='background:darkgray;color:white;font-size:larger;'><center>"+title+"</center></div>" +
		"<div style='padding:5px;'>"+content+"</div>" +
		"<div style='position:absolute;bottom:0px;left:0px;width:100%;background:darkgray;text-align:right;'><button onclick='hidePopUp();'>OK</button></div>";
	div.style.visibility = "visible";
}

/**
 * Hide popup
 */
function hidePopUp() {
	if (_pg_sim_div) {
		_pg_sim_div.style.visibility = "hidden";
	}
}

/**
 * Popup div
 */
_pg_sim_div = null;

// Send parent frame our window object
parent.iframeWindow = window;