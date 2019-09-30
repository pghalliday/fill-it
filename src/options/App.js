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
  Breadcrumbs,
  Tree,
  FormGroup,
  InputGroup,
  Alignment,
  Classes,
  ContextMenu,
  Menu,
  MenuItem,
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
      <>
        <Navbar
          fixedToTop="true"
        >
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>{t('appName')}</NavbarHeading>
            <NavbarDivider />
            <Breadcrumbs items={store.selectedPath} />
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
              onNodeContextMenu={this.handleNodeContextMenu.bind(this, t)}
              className={Classes.ELEVATION_0}
            />
          </Box>
          <Box
            width={[1, CONTENT_WIDTH]}
            p={3}>
            {store.selected ? (
              <>
                <FormGroup
                  label={t('urlLabel')}
                  labelFor="url-input"
                  inline="true"
                >
                  <InputGroup
                    id="url-input"
                    placeholder={t('urlPlaceholder')}
                    value={store.selectedUrl}
                    onChange={this.handleUrlChange}
                  />
                </FormGroup>
                <div>
                  <pre>{JSON.stringify(store.selectedFields, null, 2)}</pre>
                </div>
              </>
            ) : (
              <div>
                Nothing selected
              </div>
            )}
          </Box>
        </Flex>
      </>
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

  handleNodeContextMenu(t, nodeData, path, e) {
    e.preventDefault();
    ContextMenu.show(
        <Menu>
          <MenuItem
            text={t('menuRename')}
            onClick={() => this.renameNode(nodeData.id)}
          />
        </Menu>,
        {left: e.clientX, top: e.clientY},
    );
  }

  renameNode(uuid) {
    console.log(uuid);
  }

  handleUrlChange() {
    console.log('handleUrlChange');
  }
}
