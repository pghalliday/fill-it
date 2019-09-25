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
    return nodesFromEntries({
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
      return selected.entry.fields;
    } else {
      return undefined;
    }
  }

  @action.bound @storage async newExtracted(data) {
    console.log(data);
    console.log(t('extractedGroup'));
    this.addGroup(t('extractedGroup'));
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

  @action.bound @storage async addGroup(name, parentUuid) {
    const parentCollection =
      parentUuid ?
      this.entriesByUuid[parentUuid].entry.children :
      this.fieldSets;
    if (_.find(parentCollection, (node) => node.name === name)) {
      // group already exists!
    } else {
      parentCollection.push({
        uuid: uuidv4(),
        type: types.GROUP,
        children: [],
        name,
      });
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
      await original.apply(this, args);
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
    label: (
      <Tooltip content={entry.name} position={Position.RIGHT}>
        {entry.name}
      </Tooltip>
    ),
    childNodes: nodesFromEntries({
      entries: entry.children,
      expandedNodes,
      selectedNode,
    }),
  };
}

function fieldSetNodeFromEntry({entry, selectedNode}) {
  const isSelected = entry.uuid === selectedNode;
  return {
    id: entry.uuid,
    icon: icons.DOCUMENT,
    label: (
      <Tooltip content={entry.name} position={Position.RIGHT}>
        {entry.name}
      </Tooltip>
    ),
    isSelected,
  };
}

export const store = new Store();
