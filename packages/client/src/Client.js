/*
  Copyright 2020-2022 Lowdefy, Inc

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

import Block from './block/Block.js';
import Context from './Context.js';
import DisplayMessage from './DisplayMessage.js';
import Head from './Head.js';
import ProgressBarController from './ProgressBarController.js';

import initLowdefyContext from './initLowdefyContext.js';

const Client = ({
  Components,
  config,
  resetContext = { reset: false, setReset: () => undefined },
  router,
  stage,
  types,
  window,
}) => {
  const lowdefy = initLowdefyContext({ Components, config, router, stage, types, window });
  return (
    <>
      <ProgressBarController
        id="lowdefy-progress-bar"
        key={`${config.pageConfig.id}-progress-bar`}
        lowdefy={lowdefy}
        resetContext={resetContext}
      />
      <DisplayMessage
        id="lowdefy-display-message"
        key={`${config.pageConfig.id}-display-message`}
        Component={lowdefy._internal.blockComponents.Message}
        methods={{
          registerMethod: (_, method) => {
            lowdefy._internal.displayMessage = method;
          },
        }}
      />
      <Context
        key={config.pageConfig.id}
        config={config.pageConfig}
        lowdefy={lowdefy}
        resetContext={resetContext}
      >
        {(context) => {
          if (!context._internal.onInitDone) return '';
          return (
            <>
              <Head
                Component={Components.Head}
                properties={context._internal.RootBlocks.map[config.pageConfig.id].eval.properties}
              />
              <Block
                block={context._internal.RootBlocks.map[config.pageConfig.id]}
                Blocks={context._internal.RootBlocks}
                context={context}
                lowdefy={lowdefy}
                parentLoading={false}
              />
            </>
          );
        }}
      </Context>
    </>
  );
};

export default Client;
