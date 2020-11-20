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

import GoogleSheetAppendMany from './GoogleSheetAppendMany';
import { ConfigurationError } from '../../../context/errors';
import testSchema from '../../../utils/testSchema';

const mockAddRows = jest.fn();
jest.mock('../getSheet', () => () => ({
  addRows: mockAddRows,
}));

const { resolver, schema, checkRead, checkWrite } = GoogleSheetAppendMany;
const mockAddRowsDefaultImp = (rows) => rows.map((row) => ({ ...row, _sheet: {} }));

test('googleSheetAppendMany', async () => {
  mockAddRows.mockImplementation(mockAddRowsDefaultImp);
  const res = await resolver({
    request: {
      rows: [{ id: '1', name: 'John', age: '34', birth_date: '2020/04/26', married: 'TRUE' }],
    },
    connection: {},
  });
  expect(res).toEqual([
    {
      id: '1',
      name: 'John',
      age: '34',
      birth_date: '2020/04/26',
      married: 'TRUE',
    },
  ]);
});

test('googleSheetAppendMany, rows empty array', async () => {
  mockAddRows.mockImplementation(mockAddRowsDefaultImp);
  const res = await resolver({
    request: {
      rows: [],
    },
    connection: {},
  });
  expect(res).toEqual([]);
});

test('googleSheetAppendMany, transform types', async () => {
  mockAddRows.mockImplementation(mockAddRowsDefaultImp);
  const res = await resolver({
    request: {
      rows: [
        {
          id: '1',
          name: 'John',
          age: 34,
          birth_date: new Date('2020-04-26T00:00:00.000Z'),
          married: true,
        },
      ],
    },
    connection: {
      columnTypes: {
        name: 'string',
        age: 'number',
        married: 'boolean',
        birth_date: 'date',
      },
    },
  });
  expect(res).toEqual([
    {
      id: '1',
      name: 'John',
      age: '34',
      birth_date: '2020-04-26T00:00:00.000Z',
      married: 'TRUE',
    },
  ]);
});

test('valid request schema', () => {
  const request = {
    rows: [
      {
        name: 'name',
      },
    ],
  };
  expect(testSchema({ schema, object: request })).toBe(true);
});

test('request properties is not an object', () => {
  const request = 'request';
  expect(() => testSchema({ schema, object: request })).toThrow(ConfigurationError);
  expect(() => testSchema({ schema, object: request })).toThrow(
    'GoogleSheetAppendMany request properties should be an object.'
  );
});

test('rows is not an array', () => {
  const request = {
    rows: true,
  };
  expect(() => testSchema({ schema, object: request })).toThrow(ConfigurationError);
  expect(() => testSchema({ schema, object: request })).toThrow(
    'GoogleSheetAppendMany request property "rows" should be an array.'
  );
});

test('rows is not an array of objects', () => {
  const request = {
    rows: [1, 2, 3],
  };
  expect(() => testSchema({ schema, object: request })).toThrow(ConfigurationError);
  // Gives an error message for each item in array
  expect(() => testSchema({ schema, object: request })).toThrow(
    'GoogleSheetAppendMany request property "rows" should be an array of objects.; GoogleSheetAppendMany request property "rows" should be an array of objects.'
  );
});

test('rows is missing', () => {
  const request = {};
  expect(() => testSchema({ schema, object: request })).toThrow(ConfigurationError);
  expect(() => testSchema({ schema, object: request })).toThrow(
    'GoogleSheetAppendMany request should have required property "rows".'
  );
});

test('checkRead should be false', async () => {
  expect(checkRead).toBe(false);
});

test('checkWrite should be true', async () => {
  expect(checkWrite).toBe(true);
});
