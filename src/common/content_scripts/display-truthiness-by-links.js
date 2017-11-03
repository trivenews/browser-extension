
// var settings = require('./settings');
// settings = {
// 	apiUrl: "https://hive.trive.news/api/"
// }

loadSettings()

function doFile() {
	showRatingsNextToLinks();
}

function loadSettings() {
	chrome.runtime.sendMessage({
		message: "requestSettings"
	}, function (settings) {
		window.settings = settings;
		doFile();
	});
}

function showRatingsNextToLinks() {
	console.log("aa")
	var anchorTags = document.getElementsByTagName('a');
	var linkUrls = {};
	var anchorTagsByUrl = {}
	for (var i = 0; i < anchorTags.length; ++i) {
		if (!anchorTags[i].href)
			continue
		var anchorTag = anchorTags[i];
		if (anchorTag.protocol != 'http:' && anchorTag.protocol != 'https:')
			continue;
		var url = anchorTag.protocol + "//" + anchorTag.host + anchorTag.pathname + anchorTag.search + anchorTag.hash;
		linkUrls[url] = true;
		if (!anchorTagsByUrl[url])
			anchorTagsByUrl[url] = [];
		anchorTagsByUrl[url].push(i)
	}

	var linkUrlsArray = [];
	for (var key in linkUrls)
		linkUrlsArray.push(key);

	postAjax(settings.apiUrl + "/annotations-for-links", {
		links: linkUrlsArray
	}, function (data) {

		data = JSON.parse(data);
		console.log("Data is ", data)
		for (var url in data.links) {
			console.log(data.links)
			if (!anchorTagsByUrl[url])
				return;
			var truthiness = data.links[url];
			var color = getTruthinessColor(truthiness);

			var imgURL = chrome.extension.getURL("images/confused.png");
			anchorTagsByUrl[url].forEach(function (index) {
				var anchorTag = anchorTagsByUrl[url][index];

				var ratingEmoticon = document.createElement("img");
				ratingEmoticon.style.width = "10px";
				ratingEmoticon.style.height = "10px";
				ratingEmoticon.style.display = "inline";
				ratingEmoticon.style.marginLeft = "3px"
				ratingEmoticon.src = imgURL;
				anchorTags[index].appendChild(ratingEmoticon);

				return
				//this is if you want color instead of icon
				var ratingColorBlock = document.createElement("div");
				ratingColorBlock.style.width = "10px";
				ratingColorBlock.style.height = "10px";
				ratingColorBlock.style.float = "right";
				ratingColorBlock.style.marginLeft = "3px"
				ratingColorBlock.style.backgroundColor = color;
				anchorTags[index].appendChild(ratingColorBlock)
			})
		}
	});

	function getTruthinessColor(truthiness) {
		if (!truthiness)
			truthiness = 0;
		if (truthiness < -50)
			return "#F03E3E"
		if (truthiness < 0)
			return "#ff920b"
		if (truthiness < 50)
			return "#FFDD00"
		return "#57de36"
	}

	function postAjax(url, data, success) {
		var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
		xmlhttp.open("POST", url);
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState > 3 && xmlhttp.status == 200) { success(xmlhttp.responseText); }
		};
		xmlhttp.send(JSON.stringify(data));
		return xmlhttp;
	}
}