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
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import dynamic from 'next/dynamic';

import Auth from '../lib/auth/Auth.js';

// Must be in _app due to next specifications.
import '../build/plugins/styles.less';

function App({ Component, pageProps: { session, rootConfig, pageConfig } }) {
  return (
    <Auth session={session}>
      {(auth) => <Component auth={auth} rootConfig={rootConfig} pageConfig={pageConfig} />}
    </Auth>
  );
}

const DynamicApp = dynamic(() => Promise.resolve(App), {
  ssr: false,
});

export default DynamicApp;
