const tagNames = [
	'input',
	'textarea',
];

chrome.runtime.onConnect.addListener(function(port) {
	port.onMessage.addListener(function(message) {
		console.log(message);
		switch (message.type) {
			case 'EXTRACT': 
				extract(port);
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

function extract(port) {
	const elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
	const list = [];
	elements.reduce(function(list, element) {
		const tagName = element.tagName;
		if (tagNames.indexOf(tagName) !== -1) {
			const elementData = {
				tagName,
				id: element.id,
				className: element.className,
				value: element.value,
				innerHTML: element.innerHTML,
			};
			console.log(elementData);
			list.push(elementData);
			return list;
		}
	}, list);
	port.postMessage({
		type: 'EXTRACTED',
		data: list,
	});
}

console.log('Fill It activated!');
