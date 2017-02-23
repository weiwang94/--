var log = function() {
	console.log.apply(console, arguments)
}

var e = function(selector) {
    return document.querySelector(selector)
}

var es = function(selector) {
    return document.querySelectorAll(selector)
}

var find = function(element, html) {
	return element.querySelector(html)
}

var appendHtml = function(element, html) {
	element.insertAdjacentHTML('beforeend', html)
}

var getElement = function(element) {
	return document.querySelector(element)
}

var bindEvent = function(element, eventName, callback) {
	if(element !== null) {
		element.addEventListener(eventName, callback)
	}
}

var bindEvents = function(element, eventName, callback) {
	if(element.length > 0) {
		for (var i = 0; i < element.length; i++) {
			element[i].addEventListener(eventName, callback)
		}
	}
}

var toggleClass = function(element, className) {
	if(element.classList.contains(className)) {
		element.classList.remove(className)
	}else {
		element.classList.add(className)
	}
}

var removeAll = function(tags) {
 	    for (var i = 0; i < tags.length; i++) {
	        var tag = tags[i]
	        tag.remove()
	    }
}
