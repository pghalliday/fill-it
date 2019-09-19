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

@observer
@withTranslation()
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
                    onNodeClick={this.handleNodeClick}
                    onNodeCollapse={this.handleNodeCollapse}
                    onNodeExpand={this.handleNodeExpand}
                    className={Classes.ELEVATION_0}
                />
				<div>
					<pre>{store.report}</pre>
				</div>
			</div>
		);
	}


}