import uuidv4 from 'uuid/v4';
import {
  types,
  tagNames,
  inputTypes,
} from '../lib/constants';
import {
  getFieldSets,
  setFieldSets,
} from '../lib/chrome-storage';

const DEFAULT_FIELD_SETS = [{
  uuid: uuidv4(),
  type: types.GROUP,
  name: 'examples',
  children: [{
    uuid: uuidv4(),
    type: types.FIELD_SET,
    name: 'foo',
    url: 'https://foo.com/',
    list: [{
      id: 'foo input 1',
      tagName: tagNames.INPUT,
      type: inputTypes.TEXT,
      value: 'foo value 1',
    }, {
      tagName: tagNames.INPUT,
      type: inputTypes.TEXT,
      id: 'foo input 2',
      value: 'foo value 2',
    }],
  }, {
    uuid: uuidv4(),
    type: types.FIELD_SET,
    name: 'bar',
    url: 'https://bar.com/',
    list: [{
      tagName: tagNames.INPUT,
      type: inputTypes.TEXT,
      id: 'bar input 1',
      value: 'bar value 1',
    }, {
      tagName: tagNames.INPUT,
      type: inputTypes.TEXT,
      id: 'bar input 2',
      value: 'bar value 2',
    }],
  }],
}];

chrome.runtime.onInstalled.addListener(async () => {
  if (!(await getFieldSets())) {
    await setFieldSets(DEFAULT_FIELD_SETS);
  }
});
