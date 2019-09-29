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
              className={Classes.ELEVATION_0}
            />
          </Box>
          <Box
            width={[1, CONTENT_WIDTH]}
            p={3}>
            {store.selected ? (
              <>
                <FormGroup
                  label={t('nameLabel')}
                  labelFor="name-input"
                  labelInfo={t('requiredLabelInfo')}
                  inline="true"
                >
                  <InputGroup
                    id="name-input"
                    placeholder={t('namePlaceholder')}
                    value={store.selectedName}
                    onChange={this.handleNameChange}
                  />
                </FormGroup>
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

  handlePathChange() {
    console.log('handlePathChange');
  }

  handleNameChange() {
    console.log('handleNameChange');
  }

  handleUrlChange() {
    console.log('handleUrlChange');
  }
}
