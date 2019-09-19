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

class Store {
	@observable fieldSets;
	@observable extracted;
	@observable error;

	constructor() {
		autorun(() => console.log(this.report));
	}

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
		return [
		];
	}
}

export const store = new Store();