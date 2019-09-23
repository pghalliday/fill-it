import {
  observable,
  computed,
} from 'mobx';
import {
  getFieldSets,
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

class Store {
  @observable fieldSets;
  @observable error;
  @observable expandedNodes = {};
  @observable selectedNode;

  async init() {
    try {
      this.fieldSets = await getFieldSets(),
      watchExtracted(this.newExtracted.bind(this));
    } catch (error) {
      this.error = error.toString();
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

  async newExtracted(data) {
    console.log(data);
    console.log(t('extractedGroup'));
  }

  selectNode(uuid) {
    if (this.entriesByUuid[uuid].entry.type === types.FIELD_SET) {
      this.selectedNode = uuid;
    };
  }

  expandNodes(uuids) {
    uuids.forEach(this.expandNode.bind(this));
  }

  expandNode(uuid) {
    this.expandedNodes = {
      ...this.expandedNodes,
      [uuid]: true,
    };
  }

  collapseNode(uuid) {
    this.expandedNodes = _.omit(this.expandedNodes, uuid);
  }
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
