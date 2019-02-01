var d = document;

var request_results = [];

function parseListing(){
	var b = document.querySelector("button");
	var url 		= d.getElementById('url').value.trim();
	var page_from 	= parseInt(d.getElementById('page_from').value.trim()); 
	var page_to 	= parseInt(d.getElementById('page_to').value.trim());
	var offset 		= parseInt(d.getElementById('offset').value.trim());
	var selector 	= d.getElementById('selector').value.trim();
	var val 		= d.getElementById('val').value.trim();

	if (url) {
		b.setAttribute("disabled", "disabled");
		d.getElementById('progress').style.display = 'table';
		d.getElementById('status').style.display = 'inline-block'; 
		parse(url, selector+val, page_from, page_to, offset); 

		console.log(request_results);
	}
}

function parseItems(url_list){
	//console.log(url_list);
	var selector = d.getElementById('selector').value.trim();
	var val = d.getElementById('val').value.trim();
	var len = url_list.length - 1;
	var results = parse(url_list, '.hp__hotel-name');
	console.log(results);
	return results;
}

function parse(url_list, selector, page_from = false, page_to = false, offset = false){
	var results = [];
	if (typeof(url_list) == 'object') {
		results = url_list; 
		url_list.forEach(function(url){
			request(url, selector);
		});

	} else {
	
		for (var i = page_from; i <= page_to; i += offset) {
			request(url_list+'&offset='+i, selector, page_from, page_to, offset);
		}

		return results;
	}	
}

function writeFile(str){
	return true;
}

// AJAX PURE JAVASCRIPT
function request(url, selector, page_from, page_to, offset){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		    var parser = new DOMParser();
			var html = parser.parseFromString(this.response, "text/html");
			var nodelist = html.querySelectorAll(selector);
			var responseUrl = this.responseURL;
			nodelist.forEach(function(item){
				urlListBuilding(item, responseUrl);
			});
			console.log(nodelist);
			progressBar(parseInt(request_results.length/(page_to+offset)*100));
		}
	}
	xhttp.open("GET", url, true);
	xhttp.send();

	return request_results;
}

function progressBar(index) {
  var bar = d.getElementById("bar");
  var percent = d.getElementById("percent");
  var width = 0;
      width = index; 
      bar.style.width = width + '%'; 
      percent.innerHTML = width + '%';
      if (index == 100) { d.getElementById('status').innerText = 'Complete! Please reload page!'; }
}

function getLocation(href) {
    var l = d.createElement("a");
    l.href = href;
    return 'https://'+l.hostname;
};

function urlListBuilding(item, responseUrl){
	item.url = getLocation(responseUrl)+item.href.substring(10);
	var url = Object.assign({url: item.url}, {title: item.textContent});
	request_results.push(url);
}

d.getElementById("parse").addEventListener("click", parseListing);