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
  MenuDivider,
} from '@blueprintjs/core';
import {
  Flex,
  Box,
} from 'reflexbox';
import {
  icons,
} from '../lib/constants';

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
              onNodeDoubleClick={this.handleNodeDoubleClick.bind(this)}
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

  handleNodeDoubleClick(nodeData) {
    this.props.store.toggleExpanded(nodeData.id);
  }

  handleNodeExpand(nodeData) {
    this.props.store.expandNode(nodeData.id);
  }

  handleNodeCollapse(nodeData) {
    this.props.store.collapseNode(nodeData.id);
  }

  handleNodeContextMenu(t, nodeData, path, e) {
    e.preventDefault();
    const menuItems = {
      divider: (<MenuDivider/>),
      new: menuItem({
        icon: icons.NEW,
        text: t('menuNew'),
        onClick: this.new.bind(this),
      }),
      newGroup: menuItem({
        icon: icons.NEW_GROUP,
        text: t('menuNewGroup'),
        onClick: this.newGroup.bind(this),
      }),
      import: menuItem({
        icon: icons.IMPORT,
        text: t('menuImport'),
        onClick: this.import.bind(this),
      }),
      export: menuItem({
        icon: icons.EXPORT,
        text: t('menuExport'),
        onClick: this.export.bind(this),
      }),
      cut: menuItem({
        icon: icons.CUT,
        text: t('menuCut'),
        onClick: this.cut.bind(this),
      }),
      copy: menuItem({
        icon: icons.COPY,
        text: t('menuCopy'),
        onClick: this.copy.bind(this),
      }),
      paste: menuItem({
        icon: icons.PASTE,
        text: t('menuPaste'),
        onClick: this.paste.bind(this),
        disabled: true,
      }),
      rename: menuItem({
        icon: icons.RENAME,
        text: t('menuRename'),
        onClick: this.rename.bind(this),
      }),
      delete: menuItem({
        icon: icons.DELETE,
        text: t('menuDelete'),
        onClick: this.delete.bind(this),
      }),
    };
    const lookup = (name) => menuItems[name];
    const context = nodeData.id === 0 ? [
      'new',
      'newGroup',
      'divider',
      'import',
      'export',
      'divider',
      'paste',
    ].map(lookup) : [
      'new',
      'newGroup',
      'divider',
      'import',
      'export',
      'divider',
      'cut',
      'copy',
      'paste',
      'divider',
      'rename',
      'delete',
    ].map(lookup);
    ContextMenu.show(
        <Menu>
          {context}
        </Menu>,
        {left: e.clientX, top: e.clientY},
    );
  }

  new() {
    console.log('new');
  }

  newGroup() {
    console.log('newGroup');
  }

  import() {
    console.log('import');
  }

  export() {
    console.log('export');
  }

  cut() {
    console.log('cut');
  }

  copy() {
    console.log('copy');
  }

  paste() {
    console.log('paste');
  }

  rename() {
    console.log('rename');
  }

  delete() {
    console.log('delete');
  }

  handleUrlChange() {
    console.log('handleUrlChange');
  }
}

function menuItem({
  icon,
  text,
  onClick,
  disabled = false,
}) {
  return (
    <MenuItem
      icon={icon}
      text={text}
      onClick={onClick}
      disabled={disabled}
    />
  );
}
