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

/* eslint-disable max-classes-per-file */
import { WebParser } from '@lowdefy/operators';
import _menu from './menu.js';

const arrayIndices = [1];

const context = {
  _internal: {
    lowdefy: {
      inputs: { id: true },
      lowdefyGlobal: { global: true },
      menus: [
        {
          menuId: 'default',
        },
        {
          menuId: 'm_1',
        },
        {
          menuId: 'm_2',
        },
      ],
      urlQuery: { urlQuery: true },
      user: { user: true },
    },
  },
  eventLog: [{ eventLog: true }],
  id: 'id',
  requests: [{ requests: true }],
  state: { state: true },
};

const operators = {
  _menu,
};

console.error = () => {};

test('_menu using string menuId', () => {
  const input = { a: { _menu: 'default' } };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({
    a: {
      menuId: 'default',
    },
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_menu using index', () => {
  const input = { a: { _menu: 1 } };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({
    a: {
      menuId: 'm_1',
    },
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_menu in object', () => {
  const input = { a: { _menu: 'default' } };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({
    a: {
      menuId: 'default',
    },
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_menu full menus', () => {
  const input = { _menu: true };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual([
    {
      menuId: 'default',
    },
    {
      menuId: 'm_1',
    },
    {
      menuId: 'm_2',
    },
  ]);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_menu null', () => {
  const input = { _menu: null };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toBe(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _menu must be of type string, number or object. Received: null at locationId.],
    ]
  `);
});

test('_menu param object value', () => {
  const input = {
    _menu: {
      value: 'm_2',
    },
  };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({ menuId: 'm_2' });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_menu param object index', () => {
  const input = {
    _menu: {
      index: 2,
    },
  };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({ menuId: 'm_2' });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_menu params object value not string', () => {
  const input = {
    _menu: {
      value: 1,
    },
  };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toBe(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _menu.value must be of type string. Received: {"value":1} at locationId.],
    ]
  `);
});

test('_menu params object index not number', () => {
  const input = {
    _menu: {
      index: 'a',
    },
  };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toBe(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _menu.index must be of type number. Received: {"index":"a"} at locationId.],
    ]
  `);
});

test('_menu param object all', () => {
  const input = {
    _menu: {
      all: true,
    },
  };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual([
    {
      menuId: 'default',
    },
    {
      menuId: 'm_1',
    },
    {
      menuId: 'm_2',
    },
  ]);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_menu param object all and value', () => {
  const input = {
    _menu: {
      all: true,
      value: 'default',
    },
  };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual([
    {
      menuId: 'default',
    },
    {
      menuId: 'm_1',
    },
    {
      menuId: 'm_2',
    },
  ]);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_menu param object invalid', () => {
  const input = {
    _menu: {
      other: true,
    },
  };
  const parser = new WebParser({ context, operators });
  const res = parser.parse({ input, location: 'locationId', arrayIndices });
  expect(res.output).toEqual(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _menu must be of type string, number or object. Received: {"other":true} at locationId.],
    ]
  `);
});
