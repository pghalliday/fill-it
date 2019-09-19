import React from 'react';
import {
	withTranslation,
} from 'react-i18next';
import {
	observer,
} from 'mobx-react';

import {
	Navbar,
	NavbarGroup,
	NavbarHeading,
	NavbarDivider,
	Button,
	Tree,
	Alignment,
	Classes,
} from '@blueprintjs/core';

@withTranslation()
// WARNING: the observer decorator has to come after withTranslation or it does not work!!
@observer
export class App extends React.Component {
	render() {
		const {
			store,
			t,
		} = this.props;

		return (
			<div>
				<Navbar>
					<NavbarGroup align={Alignment.LEFT}>
						<NavbarHeading>{t('appName')}</NavbarHeading>
						<NavbarDivider />
				        <Button className="bp3-minimal" icon="menu" />
					</NavbarGroup>
				</Navbar>
                <Tree
                    contents={store.nodes}
                    onNodeClick={this.handleNodeClick.bind(this)}
                    onNodeCollapse={this.handleNodeCollapse.bind(this)}
                    onNodeExpand={this.handleNodeExpand.bind(this)}
                    className={Classes.ELEVATION_0}
                />
				<div>
					<pre>{store.report}</pre>
				</div>
			</div>
		);
	}

	handleNodeClick(nodeData) {
		this.props.store.selectNode(nodeData.id);
	}

	handleNodeExpand(nodeData) {
		this.props.store.expandNode(nodeData.id);
	}

	handleNodeCollapse(nodeData) {
		this.props.store.collapseNode(nodeData.id);
	}
}