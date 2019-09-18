import React from 'react';
import {
	observer,
} from 'mobx-react';

@observer
export class FieldSetList extends React.Component {
	render() {
		const store = this.props.store;
		return (
			<div>
				<ul>
				{
					store.fieldSets.map(
						fieldSet => <FieldSetListItem fieldSet={ fieldSet } key={ fieldSet.id } />
					)
				}
				</ul>
				<button onClick={ this.onNewFieldSet }>New Field Set</button>
				<pre>{ store.report }</pre>
			</div>
		);
	}
}