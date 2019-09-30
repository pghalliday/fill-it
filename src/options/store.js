import uuidv4 from 'uuid/v4';
import {
  observable,
  computed,
  action,
  toJS,
} from 'mobx';
import {
  getFieldSets,
  setFieldSets,
  watchExtracted,
} from '../lib/chrome-storage';
import _ from 'lodash';
import {
  types,
  icons,
} from '../lib/constants';
import React from 'react';
import {
  Position,
  Tooltip,
} from '@blueprintjs/core';
import i18n from './i18n';
const t = i18n.t.bind(i18n);

@storageClass({
  fieldSets: setFieldSets,
})
class Store {
  @observable fieldSets = [];
  @observable errors = [];
  @observable expandedNodes = {};
  @observable selectedNode;

  @action.bound async init() {
    try {
      this.fieldSets = await getFieldSets(),
      watchExtracted(this.newExtracted.bind(this));
    } catch (error) {
      this.error = error;
    }
  }

  @computed get errorCount() {
    return this.errors.length;
  }

  @computed get error() {
    return this.errors[0];
  }

  @action.bound dismissError() {
    this.errors.shift();
  }

  @action.bound set error(error) {
    if (error) {
      this.errors.push(error);
    } else {
      this.dismissError();
    }
  }

  @computed get report() {
    return JSON.stringify(this, null, 2);
  }

  @computed get nodes() {
    return rootNode({
      entries: this.fieldSets,
      expandedNodes: this.expandedNodes,
      selectedNode: this.selectedNode,
      selectedPath: this.selected ? this.selected.path : [],
    });
  }

  @computed get entriesByUuid() {
    return entriesByUuid(this.fieldSets, []);
  }

  @computed get selected() {
    return this.entriesByUuid[this.selectedNode];
  }

  @computed get selectedPath() {
    const selected = this.selected;
    if (selected) {
      return [...selected.path.map((group, index) => ({
        icon: icons.FOLDER_CLOSE,
        text: this.entriesByUuid[group].entry.name,
        onClick: this.expandNodes.bind(
            this,
            selected.path.slice(0, index),
        ),
      })), {
        icon: icons.DOCUMENT,
        text: selected.entry.name,
        onClick: this.expandNodes.bind(
            this,
            selected.path,
        ),
      }];
    } else {
      return [];
    }
  }

  @computed get selectedName() {
    const selected = this.selected;
    if (selected) {
      return selected.entry.name;
    } else {
      return undefined;
    }
  }

  @computed get selectedUrl() {
    const selected = this.selected;
    if (selected) {
      return selected.entry.url;
    } else {
      return undefined;
    }
  }

  @computed get selectedFields() {
    const selected = this.selected;
    if (selected) {
      return selected.entry.list;
    } else {
      return undefined;
    }
  }

  @action.bound @storage async newExtracted(data) {
    const group = await this.addGroup(t('extractedGroup'));
    console.log(group);
    const fieldSet = await this.addFieldSet({
      name: new Date().toISOString(),
      ...data,
    }, group.uuid);
    const entry = this.entriesByUuid[fieldSet.uuid];
    this.selectNode(entry.entry.uuid);
    this.expandNodes(entry.path);
  }

  @action.bound selectNode(uuid) {
    if (this.entriesByUuid[uuid].entry.type === types.FIELD_SET) {
      this.selectedNode = uuid;
    };
  }

  @action.bound expandNodes(uuids) {
    uuids.forEach(this.expandNode.bind(this));
  }

  @action.bound expandNode(uuid) {
    this.expandedNodes = {
      ...this.expandedNodes,
      [uuid]: true,
    };
  }

  @action.bound collapseNode(uuid) {
    this.expandedNodes = _.omit(this.expandedNodes, uuid);
  }

  @action.bound toggleExpanded(uuid) {
    if (this.entriesByUuid[uuid].entry.type === types.GROUP) {
      if (this.expandedNodes[uuid]) {
        this.collapseNode(uuid);
      } else {
        this.expandNode(uuid);
      }
    };
  }

  @action.bound @storage async addGroup(name, parentUuid) {
    const parentCollection =
      parentUuid ?
      this.entriesByUuid[parentUuid].entry.children :
      this.fieldSets;
    let group = _.find(parentCollection, (node) => node.name === name);
    if (group) {
      return group;
    } else {
      group = {
        type: types.GROUP,
        uuid: uuidv4(),
        children: [],
        name,
      };
      parentCollection.push(group);
      return group;
    }
  }

  @action.bound @storage async addFieldSet(data, parentUuid) {
    console.log(parentUuid);
    const parentCollection =
      parentUuid ?
      this.entriesByUuid[parentUuid].entry.children :
      this.fieldSets;
    console.log(parentCollection);
    let fieldSet = _.find(parentCollection, (node) => node.name === data.name);
    if (fieldSet) {
      this.error = new Error(t('fieldSetExistsError', data));
      return fieldSet;
    } else {
      fieldSet = {
        type: types.FIELD_SET,
        uuid: uuidv4(),
        ...data,
      };
      parentCollection.push(fieldSet);
      return fieldSet;
    }
  }
}

function storageClass(storageFields) {
  return function(Class) {
    return (...args) => {
      const instance = new Class(...args);
      instance._storageChangeCount = 0;
      instance._storageFields = storageFields;
      return instance;
    };
  };
}

function storage(target, name, descriptor) {
  const original = descriptor.value;
  if (typeof original === 'function') {
    descriptor.value = async function(...args) {
      this._storageChangeCount++;
      const ret = await original.apply(this, args);
      this._storageChangeCount--;
      if (this._storageChangeCount === 0) {
        try {
          await Promise.all(_.map(this._storageFields, (updateFunc, field) => {
            const data = toJS(this[field]);
            return updateFunc(data);
          }));
        } catch (error) {
          this.error = error;
        }
      }
      return ret;
    };
  }
  return descriptor;
}

function entriesByUuid(entries, path) {
  return entries.reduce((map, entry) => {
    map[entry.uuid] = {
      entry: entry,
      path,
    };
    switch (entry.type) {
      case types.GROUP:
        map = {
          ...map,
          ...entriesByUuid(entry.children, [...path, entry.uuid]),
        };
        break;
      case types.FIELD_SET:
        break;
      default:
        console.error(new Error(`Unknown type: ${entry.type}`));
        break;
    }
    return map;
  }, {});
}

function rootNode({
  entries,
  expandedNodes,
  selectedNode,
  selectedPath,
}) {
  return [{
    id: 0,
    icon: icons.ROOT,
    isExpanded: true,
    hasCaret: false,
    isSelected: false,
    label: nodeLabel(t('rootNodeName')),
    childNodes: nodesFromEntries({
      entries,
      expandedNodes,
      selectedNode,
      selectedPath,
    }),
  }];
}

function nodesFromEntries({
  entries,
  expandedNodes,
  selectedNode,
  selectedPath,
}) {
  return entries.map((entry) => {
    switch (entry.type) {
      case types.GROUP:
        return groupNodeFromEntry({
          entry,
          expandedNodes,
          selectedNode,
          selectedPath,
        });
        break;
      case types.FIELD_SET:
        return fieldSetNodeFromEntry({
          entry,
          selectedNode,
        });
        break;
      default:
        console.error(new Error(`Unknown type: ${entry.type}`));
        break;
    }
  }).sort((a, b) => {
    if (a.nodeData.type === types.GROUP) {
      if (b.nodeData.type === types.GROUP) {
        return a.nodeData.name.localeCompare(b.nodeData.name);
      } else {
        return -1;
      }
    } else {
      if (b.nodeData.type === types.GROUP) {
        return 1;
      } else {
        return a.nodeData.name.localeCompare(b.nodeData.name);
      }
    }
  });
}

function groupNodeFromEntry({
  entry,
  expandedNodes,
  selectedNode,
  selectedPath,
}) {
  const isExpanded = expandedNodes[entry.uuid];
  return {
    id: entry.uuid,
    icon: isExpanded ? icons.FOLDER_OPEN : icons.FOLDER_CLOSE,
    isExpanded,
    isSelected: !isExpanded && selectedPath.indexOf(entry.uuid) !== -1,
    label: nodeLabel(entry.name),
    childNodes: nodesFromEntries({
      entries: entry.children,
      expandedNodes,
      selectedNode,
    }),
    nodeData: entry,
  };
}

function fieldSetNodeFromEntry({entry, selectedNode}) {
  const isSelected = entry.uuid === selectedNode;
  return {
    id: entry.uuid,
    icon: icons.DOCUMENT,
    label: nodeLabel(entry.name),
    isSelected,
    nodeData: entry,
  };
}

function nodeLabel(name) {
  return (
    <Tooltip content={name} position={Position.RIGHT}>
      {name}
    </Tooltip>
  );
}

export const store = new Store();
