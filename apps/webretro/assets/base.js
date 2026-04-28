// Source Code: https://github.com/BinBashBanana/webretro
// please dont use IE
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.fetch || !indexedDB) {
	alert("Update your browser!");
	throw "Update your browser!";
}

var fsBundleDirs, fsBundleFiles, loadStatus, romName, isPaused, wasmReady, bundleReady, biosReady, romMode, core, wIdb, romUploadCallback, latestVersion, mainCompleted, currentManager, romUploadsReady, realRomExt, currentTheme;
var bundleCdn = "./";
var bundleCdnLatest = "./";
var biosCdn = "./bios/";
var infoJsonUrl = "./assets/info.json";
var standaloneDownloadUrl = "./utils/webretro-standalone.html";