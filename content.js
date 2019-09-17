chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(message) {
		console.log(message);
		switch (message.type) {
			case 'EXTRACT': 
				extract(port, message.data);
				break;
			default:
				console.error(new Error('Unknown message type: ' + message.type))
				break;
		}
	});
	port.postMessage({
		type: 'CONNECTED',
	})
});

function extract(port, query) {
	const elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
	const tagNames = Object.keys(query.tags);
	const fields = tagNames.reduce(function(fields, tagName) {
		fields[tagName] = query.fields.concat(query.tags[tagName].fields);
		return fields;
	}, {});
	const list = elements.filter(function(element) {
		const tagName = element.tagName.toUpperCase();
		const include = tagNames.indexOf(tagName) !== -1;
		return include && checkExcludes(element, query.tags[tagName].excludes);
	}).map(function(element) {
		const tagName = element.tagName.toUpperCase();
		const elementData = fields[tagName].reduce(function(data, field) {
			data[field] = element[field];
			return data;
		}, {});
		return elementData;
	});
	console.log(list);
	port.postMessage({
		type: 'EXTRACTED',
		data: list,
	});
}

function checkExcludes(element, excludes) {
	return !excludes || excludes.reduce(function(include, exclude) {
		return include && checkExclude(element, exclude);
	}, true);
}

function checkExclude(element, exclude) {
	return Object.keys(exclude).reduce(function(include, field) {
		return include || element[field] !== exclude[field];
	}, false);
}

console.log('Fill It activated!');
