var settings = require('./settings');

var token;

module.exports = {
	submitDocument: submitDocument
}

function submitDocument(doc, headers, callback) {
	//set trive bounty on page
	postAjax(settings.apiUrl + "/documents", doc, headers, callback)
}

function postAjax(url, data, headers, success) {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", url);
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	for (var key in headers) {
		xmlhttp.setRequestHeader(key, headers[key])
	}
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState !== XMLHttpRequest.DONE)
			return;
		if (xmlhttp.readyState > 3 && xmlhttp.status == 200) {
			success(null, JSON.parse(xmlhttp.responseText));
		} else {
			console.log("ERROR");
			var json = null;
			try {
				json = JSON.parse(xmlhttp.responseText)
			} catch (e) { }
			console.log(xmlhttp)
			success({
				status: xmlhttp.status,
				text: xmlhttp.responseText,
				obj: xmlhttp,
				json: json
			})
		}
	};
	xmlhttp.send(JSON.stringify(data));
	return xmlhttp;
}