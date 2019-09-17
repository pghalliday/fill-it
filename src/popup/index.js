const query = {
	fields: ['tagName', 'id', 'className'],
	tags: {
		'INPUT': {
			fields: ['type', 'value'],
			excludes: [{
				type: 'hidden',
			}, {
				type: 'button',
			}, {
				type: 'submit',
			}, {
				type: 'image',
			}],
		},
		'TEXTAREA': {
			fields: ['innerHTML'],
		},
	},
};

const extractFormFields = document.getElementById('extractFormFields');

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	const tabId = tabs[0].id;
	const port = chrome.tabs.connect(tabId);
	port.onMessage.addListener(function(message) {
		console.log(message);
		switch (message.type) {
			case 'CONNECTED':
				init(port);
				break;
			case 'EXTRACTED':
				extract(message.data);
				break;
			default:
				console.error(new Error('Unknown message type: ' + message.type))
				break;
		}
	});
});

function init(port) {
	extractFormFields.onclick = function() {
		port.postMessage({
			type: 'EXTRACT',
			data: query,
		})
	};
}

function extract(list) {
	console.log(list);
	chrome.storage.local.set({extracted: list}, function() {
		chrome.runtime.openOptionsPage();
	});
}