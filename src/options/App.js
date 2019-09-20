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
  // EditableText,
  Alignment,
  Classes,
} from '@blueprintjs/core';
import {
  Flex,
  Box,
} from 'reflexbox';

const TREE_WIDTH = 1/5;
const CONTENT_WIDTH = 1 - TREE_WIDTH;

@withTranslation()
// WARNING: the observer decorator has to come after
// withTranslation or it does not work!!
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
        <Flex flexWrap='wrap'>
          <Box
            width={[1, TREE_WIDTH]}
            p={3}>
            <Tree
              contents={store.nodes}
              onNodeClick={this.handleNodeClick.bind(this)}
              onNodeCollapse={this.handleNodeCollapse.bind(this)}
              onNodeExpand={this.handleNodeExpand.bind(this)}
              className={Classes.ELEVATION_0}
            />
          </Box>
          <Box
            width={[1, CONTENT_WIDTH]}
            p={3}>
            {store.selected ? (
              <div>
                <div>
                  {store.selectedPath}
                </div>
                <div>
                  {store.selectedName}
                </div>
                <div>
                  {store.selectedUrl}
                </div>
                <div>
                  <pre>{JSON.stringify(store.selectedFields, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div>
                Nothing selected
              </div>
            )}
          </Box>
        </Flex>
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
