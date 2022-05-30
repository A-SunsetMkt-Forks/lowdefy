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

import { wait } from '@lowdefy/helpers';
import Wait from './Wait.js';

test('wait set ms before continuing', async () => {
  let flag = false;

  const waitAndSetFlag = async () => {
    await Wait({ params: { ms: 10 } });
    flag = true;
  };
  expect(flag).toBe(false);
  waitAndSetFlag();
  expect(flag).toBe(false);
  await wait(5);
  expect(flag).toBe(false);
  await wait(6);
  expect(flag).toBe(true);
});

test('Wait params undefined', async () => {
  expect(() => Wait({})).toThrow('Wait action "ms" param should be an integer.');
});

test('Wait params.ms not an integer', async () => {
  expect(() => Wait({ params: { key: 'value' } })).toThrow(
    'Wait action "ms" param should be an integer.'
  );
});
