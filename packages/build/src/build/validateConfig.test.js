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

import validateConfig from './validateConfig.js';
import testContext from '../test/testContext.js';

const context = testContext();

test('validateConfig no config defined', async () => {
  const components = {};
  const result = await validateConfig({ components, context });
  expect(result).toEqual({
    config: {
      auth: {
        pages: {
          roles: {},
        },
      },
      theme: {},
    },
  });
});

test('validate config theme', async () => {
  const components = {
    config: {
      theme: {
        lessVariables: {
          'primary-color': '#FF00FF',
        },
      },
    },
  };
  const result = await validateConfig({ components, context });
  expect(result).toEqual({
    config: {
      auth: {
        pages: {
          roles: {},
        },
      },
      theme: {
        lessVariables: {
          'primary-color': '#FF00FF',
        },
      },
    },
  });
});

test('validateConfig config not an object', async () => {
  const components = {
    config: 'config',
  };
  await expect(validateConfig({ components, context })).rejects.toThrow(
    'lowdefy.config is not an object.'
  );
});

test('validateConfig config invalid auth config', async () => {
  let components = {
    config: {
      auth: {
        pages: {
          protected: {},
        },
      },
    },
  };
  await expect(validateConfig({ components, context })).rejects.toThrow(
    'App "config.auth.pages.protected.$" should be an array of strings.'
  );
  components = {
    config: {
      auth: {
        pages: {
          roles: ['a'],
        },
      },
    },
  };
  await expect(validateConfig({ components, context })).rejects.toThrow(
    'App "config.auth.pages.roles" should be an object.'
  );
});

test('validateConfig config error when both protected and public pages are both arrays', async () => {
  const components = {
    config: {
      auth: {
        pages: {
          protected: [],
          public: [],
        },
      },
    },
  };
  await expect(validateConfig({ components, context })).rejects.toThrow(
    'Protected and public pages are mutually exclusive. When protected pages are listed, all unlisted pages are public by default and visa versa.'
  );
});

test('validateConfig config error when both protected and public pages are true', async () => {
  const components = {
    config: {
      auth: {
        pages: {
          protected: true,
          public: true,
        },
      },
    },
  };
  await expect(validateConfig({ components, context })).rejects.toThrow(
    'Protected and public pages are mutually exclusive. When protected pages are listed, all unlisted pages are public by default and visa versa.'
  );
});

test('validateConfig config error when protected or public are false.', async () => {
  let components = {
    config: {
      auth: {
        pages: {
          protected: false,
        },
      },
    },
  };
  await expect(validateConfig({ components, context })).rejects.toThrow(
    'Protected pages can not be set to false.'
  );
  components = {
    config: {
      auth: {
        pages: {
          public: false,
        },
      },
    },
  };
  await expect(validateConfig({ components, context })).rejects.toThrow(
    'Public pages can not be set to false.'
  );
});

test('validateConfig config error when basePath does not start with "/".', async () => {
  let components = {
    config: {
      basePath: '/base',
    },
  };
  const result = await validateConfig({ components, context });
  expect(result).toEqual({
    config: {
      auth: {
        pages: {
          roles: {},
        },
      },
      basePath: '/base',
      theme: {},
    },
  });
  components = {
    config: {
      basePath: 'base',
    },
  };
  await expect(validateConfig({ components, context })).rejects.toThrow(
    'Base path must start with "/".'
  );
});
