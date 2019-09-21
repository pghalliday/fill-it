import {
  messageTypes,
  tagNames,
  inputTypes,
  fields,
} from '../lib/constants';
import {
  setExtracted,
} from '../lib/chrome-storage';

const query = {
  fields: [fields.TAG_NAME, fields.ID],
  tags: {
    [tagNames.INPUT]: {
      fields: [fields.TYPE, fields.VALUE, fields.CHECKED],
      excludes: [{
        type: inputTypes.HIDDEN,
      }, {
        type: inputTypes.BUTTON,
      }, {
        type: inputTypes.RESET,
      }, {
        type: inputTypes.SUBMIT,
      }, {
        type: inputTypes.IMAGE,
      }],
    },
    [tagNames.TEXTAREA]: {
      fields: [fields.INNER_HTML],
    },
  },
};

const extractFormFields = document.getElementById('extractFormFields');

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  const tabId = tabs[0].id;
  const port = chrome.tabs.connect(tabId);
  port.onMessage.addListener((message) => {
    console.log(message);
    switch (message.type) {
      case messageTypes.CONNECTED:
        init(port);
        break;
      case messageTypes.EXTRACTED:
        extract(message.data);
        break;
      default:
        console.error(new Error(`Unknown message type: ${message.type}`));
        break;
    }
  });
});

function init(port) {
  extractFormFields.onclick = () => {
    port.postMessage({
      type: messageTypes.EXTRACT,
      data: query,
    });
  };
}

async function extract(list) {
  console.log(list);
  await setExtracted(list);
  chrome.runtime.openOptionsPage();
}
