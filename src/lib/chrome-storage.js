import {
  storageFields,
} from './constants';

export async function watchExtracted(callback) {
  const notifyNewValue = (newValue) => {
    if (newValue) {
      callback(newValue);
    }
  };
  notifyNewValue(await getExtracted());
  chrome.storage.local.onChanged.addListener(async (changes) => {
    const extractedChanges = changes[storageFields.EXTRACTED];
    if (extractedChanges) {
      notifyNewValue(await getExtracted());
    }
  });
}

export function getExtracted() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(storageFields.EXTRACTED, ({
      [storageFields.EXTRACTED]: extracted,
    }) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        chrome.storage.local.remove(storageFields.EXTRACTED, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(extracted);
          }
        });
      }
    });
  });
}

export function setExtracted(extracted) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({
      [storageFields.EXTRACTED]: extracted,
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
    chrome.storage.sync.get(storageFields.FIELD_SETS, ({
      [storageFields.FIELD_SETS]: fieldSets,
    }) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(fieldSets);
      }
    });
  });
}

export function setFieldSets(fieldSets) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({
      [storageFields.FIELD_SETS]: fieldSets,
    }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}
