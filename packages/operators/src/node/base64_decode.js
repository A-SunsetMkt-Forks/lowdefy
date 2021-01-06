/*
  Copyright 2020 Lowdefy, Inc

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

import { type } from '@lowdefy/helpers';

function _base64_decode({ params, location }) {
  if (!type.isString(params)) {
    throw new Error(
      `Operator Error: _base64_decode takes an string type as input. Received: ${JSON.stringify(
        params
      )} at ${location}.`
    );
  }
  const buff = Buffer.from(params, 'base64');
  return buff.toString('utf8');
}

export default _base64_decode;
