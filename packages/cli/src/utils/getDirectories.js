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

import path from 'path';

function getDirectories({ configDirectory, options }) {
  // TODO: Should the ".lowdefy" directory be configurable
  const dotLowdefy = path.resolve(configDirectory, '.lowdefy');

  return {
    config: configDirectory,
    server: options.serverDirectory
      ? path.resolve(options.serverDirectory)
      : path.join(dotLowdefy, 'server'),
    dev: options.devDirectory ? path.resolve(options.devDirectory) : path.join(dotLowdefy, 'dev'),
  };
}

export default getDirectories;
