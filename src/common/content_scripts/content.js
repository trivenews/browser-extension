console.log("BOBOHEAD")

var anchorTags = document.getElementsByTagName('a');


var linkUrls = [];
var anchorTagsByUrl = {}
for (var i = 0; i < anchorTags.length; ++i) {
	if (!anchorTags[i].href)
		continue
	var anchorTag = anchorTags[i];
	if (anchorTag.protocol != 'http:' && anchorTag.protocol != 'https:')
		continue;
	var url = anchorTag.protocol + "//" + anchorTag.host + anchorTag.pathname + anchorTag.search + anchorTag.hash;
	linkUrls.push(url);
	if (!anchorTagsByUrl[url])
		anchorTagsByUrl[url] = [];
	anchorTagsByUrl[url].push(i)
}


postAjax("http://localhost:5000/api/annotations-for-links", {
	links: linkUrls
}, function (data) {

	data = JSON.parse(data);

	for (var url in data.links) {
		console.log(data.links)
		if (!anchorTagsByUrl[url])
			return;
		var truthiness = data.links[url];
		var color = getTruthinessColor(truthiness);
		anchorTagsByUrl[url].forEach(function (index) {
			var anchorTag = anchorTagsByUrl[url][index];
			// anchorTag.style.position = "relative"
			// anchorTags[index].style.background = color;
			var ratingColorBlock = document.createElement("div");
			ratingColorBlock.style.width = "10px";
			ratingColorBlock.style.height = "10px";
			ratingColorBlock.style.float = "right";
			ratingColorBlock.style.marginLeft = "3px"
			// ratingColorBlock.style.paddingTop = "3px";
			ratingColorBlock.style.backgroundColor = color;
			console.log(ratingColorBlock);
			anchorTags[index].appendChild(ratingColorBlock)
			console.log(anchorTags[index])
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