/*
  Copyright 2020-2024 Lowdefy, Inc

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
import { Result } from 'antd';
import { blockDefaultProps, renderHtml } from '@lowdefy/block-utils';

const ResultBlock = ({ blockId, components: { Icon }, events, content, methods, properties }) => (
  <Result
    id={blockId}
    title={renderHtml({ html: properties.title, methods })}
    subTitle={renderHtml({ html: properties.subTitle, methods })}
    status={properties.status}
    icon={
      properties.icon && (
        <Icon blockId={`${blockId}_icon`} events={events} properties={properties.icon} />
      )
    }
    extra={content.extra && content.extra({ justifyContent: 'center' })}
  >
    {content.content && content.content({ justifyContent: 'center' })}
  </Result>
);

ResultBlock.defaultProps = blockDefaultProps;
ResultBlock.meta = {
  category: 'container',
  icons: [],
  styles: ['blocks/Result/style.less'],
};

export default ResultBlock;
