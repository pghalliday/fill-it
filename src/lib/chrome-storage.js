const EXTRACTED = 'extracted';
const FIELD_SETS = 'fieldSets';

export function getExtracted() {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(EXTRACTED, ({[EXTRACTED]: extracted}) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				chrome.storage.local.remove(EXTRACTED, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve(extracted);
					}
				})
			}
		});
	});
}

export function setExtracted(extracted) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({
			[EXTRACTED]: extracted,
		}, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve();
			}
		});
	});
}

export function getFieldSets() {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(FIELD_SETS, ({[FIELD_SETS]: fieldSets}) => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(fieldSets || []);
			}
		});
	});
}

export function setFieldSets(fieldSets) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.set({
			[FIELD_SETS]: fieldSets,
		}, () => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve();
			}
		});
	});
}
