/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import React from 'react';
import { blockDefaultProps } from '@lowdefy/block-utils';
import { get, mergeObjects, type } from '@lowdefy/helpers';

import Breadcrumb from '../Breadcrumb/Breadcrumb.js';
import Content from '../Content/Content.js';
import Footer from '../Footer/Footer.js';
import Header from '../Header/Header.js';
import Layout from '../Layout/Layout.js';
import Menu from '../Menu/Menu.js';
import MobileMenu from '../MobileMenu/MobileMenu.js';

const PageHeaderMenu = ({
  basePath,
  blockId,
  components: { Icon, Link },
  content,
  events,
  menus,
  methods,
  pageId,
  properties,
}) => {
  const styles = {
    layout: {
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 46px',
      sm: { padding: '0 15px' },
      md: { padding: '0 30px' },
      lg: { padding: '0 46px' },
    },
    headerContent: {
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    logo: {
      margin: '0px 30px',
      flex: '0 1 auto',
      sm: { margin: '0 10px' },
      md: { margin: '0 15px' },
    },
    lgMenu: {
      flex: '1 1 auto',
      sm: { display: 'none' },
      md: { display: 'none' },
      lg: { display: 'flex' },
    },
    mdMenu: {
      flex: '0 1 auto',
      paddingLeft: '1rem',
      sm: { display: 'flex' },
      md: { display: 'flex' },
      lg: { display: 'none' },
    },
    desktop: {
      display: 'none',
      lg: { display: 'block' },
    },
    mobile: {
      display: 'block',
      lg: { display: 'none' },
    },
    body: {
      padding: '0 40px 40px 40px',
      sm: { padding: '0 10px 10px 10px' },
      md: { padding: '0 20px 20px 20px' },
      lg: { padding: '0 40px 40px 40px' },
    },
    noBreadcrumb: {
      padding: '20px 0',
      sm: { padding: '5px 0' },
      md: { padding: '10px 0' },
    },
  };
  return (
    <Layout
      blockId={blockId}
      events={events}
      properties={{ style: mergeObjects([{ minHeight: '100vh' }, properties.style]) }}
      components={{ Icon, Link }}
      content={{
        content: () => (
          <>
            <Header
              blockId={`${blockId}_header`}
              events={events}
              components={{ Icon, Link }}
              properties={mergeObjects([
                {
                  style: styles.header,
                },
                properties.header,
              ])}
              content={{
                // TODO: use next/image
                content: () => (
                  <>
                    <Link home={true}>
                      <img
                        src={
                          (properties.logo && properties.logo.src) ||
                          (get(properties, 'header.theme') === 'light'
                            ? `${basePath}/logo-light-theme.png`
                            : `${basePath}/logo-dark-theme.png`)
                        }
                        srcSet={
                          (properties.logo && (properties.logo.srcSet || properties.logo.src)) ||
                          (get(properties, 'header.theme') === 'light'
                            ? `${basePath}/logo-square-light-theme.png 40w, ${basePath}/logo-light-theme.png 577w`
                            : `${basePath}/logo-square-dark-theme.png 40w, ${basePath}/logo-dark-theme.png 577w`)
                        }
                        sizes={
                          (properties.logo && properties.logo.sizes) ||
                          '(max-width: 576px) 40px, 577px'
                        }
                        alt={(properties.logo && properties.logo.alt) || 'Lowdefy'}
                        className={methods.makeCssClass([
                          {
                            width: 130,
                            sm: {
                              width:
                                properties.logo && properties.logo.src && !properties.logo.srcSet
                                  ? 130
                                  : 40,
                            },
                            md: { width: 130 },
                          },
                          styles.logo,
                          properties.logo && properties.logo.style,
                        ])}
                      />
                    </Link>
                    <div className={methods.makeCssClass(styles.headerContent)}>
                      <div className={methods.makeCssClass([styles.desktop, styles.lgMenu])}>
                        <Menu
                          blockId={`${blockId}_menu`}
                          basePath={basePath}
                          components={{ Icon, Link }}
                          events={events}
                          methods={methods}
                          menus={menus}
                          pageId={pageId}
                          properties={mergeObjects([
                            {
                              mode: 'horizontal',
                              collapsed: false,
                              theme: get(properties, 'header.theme') || 'dark',
                              backgroundColor: get(properties, 'header.color'),
                            },
                            properties.menu,
                            properties.menuLg,
                          ])}
                        />
                      </div>
                      {content.header &&
                        content.header(
                          mergeObjects([
                            { width: 'auto', flex: '0 1 auto' },
                            properties.header && properties.header.contentStyle,
                          ])
                        )}
                      <div className={methods.makeCssClass([styles.mobile, styles.mdMenu])}>
                        <MobileMenu
                          blockId={`${blockId}_mobile_menu`}
                          basePath={basePath}
                          components={{ Icon, Link }}
                          events={events}
                          methods={methods}
                          menus={menus}
                          pageId={pageId}
                          properties={mergeObjects([properties.menu, properties.menuMd])}
                        />
                      </div>
                    </div>
                  </>
                ),
              }}
            />
            <Content
              blockId={`${blockId}_content`}
              components={{ Icon, Link }}
              events={events}
              properties={mergeObjects([properties.content, { style: styles.body }])}
              content={{
                content: () => (
                  <>
                    {!type.isNone(properties.breadcrumb) ? (
                      <Breadcrumb
                        blockId={`${blockId}_breadcrumb`}
                        basePath={basePath}
                        components={{ Icon, Link }}
                        events={events}
                        methods={methods}
                        properties={mergeObjects([
                          properties.breadcrumb,
                          { style: { padding: '16px 0' } },
                        ])}
                        rename={{
                          events: {
                            onClick: 'onBreadcrumbClick',
                          },
                        }}
                      />
                    ) : (
                      <div className={methods.makeCssClass(styles.noBreadcrumb)} />
                    )}
                    {content.content && content.content()}
                  </>
                ),
              }}
            />
            {content.footer && (
              <Footer
                blockId={`${blockId}_footer`}
                components={{ Icon, Link }}
                events={events}
                properties={properties.footer}
                content={{
                  content: () => content.footer(),
                }}
              />
            )}
          </>
        ),
      }}
    />
  );
};

PageHeaderMenu.defaultProps = blockDefaultProps;
PageHeaderMenu.meta = {
  category: 'container',
  loading: {
    type: 'Spinner',
    properties: {
      height: '100vh',
    },
  },
  icons: [...MobileMenu.meta.icons],
  styles: ['blocks/PageHeaderMenu/style.less'],
};

export default PageHeaderMenu;
