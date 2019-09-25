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
    console.log(query.tags[tagName].fields);
    fields[tagName] = {
      ...query.fields,
      ...query.tags[tagName].fields,
    };
    return fields;
  }, {});
  const list = elements.filter((element) => {
    const tagName = element.tagName.toUpperCase();
    const include = tagNames.indexOf(tagName) !== -1;
    return include && checkExcludes(element, query.tags[tagName].excludes);
  }).map((element) => {
    const tagName = element.tagName.toUpperCase();
    const f = fields[tagName];
    const elementData = Object.keys(f).reduce((data, field) => {
      data[field] = getField(element, f[field]);
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

function getField(obj, props) {
  if (props.length > 0) {
    if (typeof obj[props[0]] === 'undefined') {
      // field does not exist so return undefined
      return;
    } else {
      return getField(obj[props[0]], props.slice(1));
    }
  } else {
    return obj;
  }
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
