import {
	autorun,
	observable,
	computed,
} from 'mobx';
import {
	getFieldSets,
	setFieldSets,
	getExtracted,
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

class Store {
	@observable fieldSets;
	@observable extracted;
	@observable error;
	@observable expandedNodes = {};
	@observable selectedNode;

	async init() {
		try{
			[this.fieldSets, this.extracted] = await Promise.all([getFieldSets(), getExtracted()]);
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
		});
	}

	selectNode(uuid) {
		this.selectedNode = uuid;
	}

	expandNode(uuid) {
		this.expandedNodes = {
			...this.expandedNodes,
			[uuid]: true,
		}
	}

	collapseNode(uuid) {
		this.expandedNodes = _.omit(this.expandedNodes, uuid);
	}
}

function nodesFromEntries({entries, expandedNodes, selectedNode}) {
	return entries.map(entry => {
		switch (entry.type) {
			case types.GROUP:
				return groupNodeFromEntry({
					entry,
					expandedNodes,
					selectedNode,
				})
				break;
			case types.FIELD_SET:
				return fieldSetNodeFromEntry({
					entry,
					selectedNode,
				})
				break;
			default:
				console.error(new Error(`Unknown type: ${entry.type}`))
				break;
		}
	});
}

function groupNodeFromEntry({entry, expandedNodes, selectedNode}) {
	const isExpanded = expandedNodes[entry.uuid];
	return {
		id: entry.uuid,
		icon: isExpanded ? icons.FOLDER_OPEN : icons.FOLDER_CLOSE,
		isExpanded,
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
	}
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
	}
}

export const store = new Store();