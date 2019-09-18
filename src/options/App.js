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
	Alignment,
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
				<div>
					<pre>{ store.report }</pre>
				</div>
			</div>
		);
	}
}