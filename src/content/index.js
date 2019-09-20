import {
  messageTypes,
} from '../lib/constants';

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((message) => {
    console.log(message);
    switch (message.type) {
      case messageTypes.EXTRACT:
        extract(port, message.data);
        break;
      default:
        console.error(new Error(`Unknown message type: ${message.type}`));
        break;
    }
  });
  port.postMessage({
    type: messageTypes.CONNECTED,
  });
});

function extract(port, query) {
  const elements = Array.prototype.slice.call(
      document.getElementsByTagName('*'),
  );
  const tagNames = Object.keys(query.tags);
  const fields = tagNames.reduce((fields, tagName) => {
    fields[tagName] = query.fields.concat(query.tags[tagName].fields);
    return fields;
  }, {});
  const list = elements.filter((element) => {
    const tagName = element.tagName.toUpperCase();
    const include = tagNames.indexOf(tagName) !== -1;
    return include && checkExcludes(element, query.tags[tagName].excludes);
  }).map((element) => {
    const tagName = element.tagName.toUpperCase();
    const elementData = fields[tagName].reduce((data, field) => {
      data[field] = element[field];
      return data;
    }, {});
    return elementData;
  });
  console.log(list);
  port.postMessage({
    type: messageTypes.EXTRACTED,
    data: {
      url: window.location.href,
      list,
    },
  });
}

function checkExcludes(element, excludes) {
  return !excludes || excludes.reduce((include, exclude) => {
    return include && checkExclude(element, exclude);
  }, true);
}

function checkExclude(element, exclude) {
  return Object.keys(exclude).reduce((include, field) => {
    return include || element[field] !== exclude[field];
  }, false);
}

console.log('Fill It activated!');
