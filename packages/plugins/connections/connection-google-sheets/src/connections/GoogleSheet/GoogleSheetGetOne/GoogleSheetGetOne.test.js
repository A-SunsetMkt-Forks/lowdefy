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

import { validate } from '@lowdefy/ajv';
import GoogleSheetGetOne from './GoogleSheetGetOne.js';

const { checkRead, checkWrite } = GoogleSheetGetOne.meta;
const schema = GoogleSheetGetOne.schema;

const mockGetRows = jest.fn();
jest.mock('../getSheet', () => () => ({
  getRows: mockGetRows,
}));

const mockGetRowsDefaultImp = ({ limit, offset }) => {
  const rows = [
    {
      _rowNumber: 2,
      _rawData: ['1', 'John', '34', '2020/04/26', 'TRUE'],
      id: '1',
      name: 'John',
      age: '34',
      birth_date: '2020/04/26',
      married: 'TRUE',
      _sheet: {},
    },
    {
      _rowNumber: 3,
      _rawData: ['2', 'Steven', '43', '2020/04/27', 'FALSE'],
      id: '2',
      name: 'Steve',
      age: '43',
      birth_date: '2020/04/27',
      married: 'FALSE',
      _sheet: {},
    },
    {
      _rowNumber: 4,
      _rawData: ['3', 'Tim', '34', '2020/04/28', 'FALSE'],
      id: '3',
      name: 'Tim',
      age: '34',
      birth_date: '2020/04/28',
      married: 'FALSE',
      _sheet: {},
    },
    {
      _rowNumber: 5,
      _rawData: ['4', 'Craig', '21', '2020-04-25T22:00:00.000Z', 'TRUE'],
      id: '4',
      name: 'Craig',
      age: '120',
      birth_date: '2020-04-25T22:00:00.000Z',
      married: 'TRUE',
      _sheet: {},
    },
  ];
  return Promise.resolve(rows.slice(offset).slice(undefined, limit));
};

test('googleSheetGetOne, first row is returned', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({ request: {}, connection: {} });
  expect(res).toEqual({
    _rowNumber: 2,
    _rawData: ['1', 'John', '34', '2020/04/26', 'TRUE'],
    id: '1',
    name: 'John',
    age: '34',
    birth_date: '2020/04/26',
    married: 'TRUE',
  });
});

test('googleSheetGetOne, empty rows returned', async () => {
  mockGetRows.mockImplementation(() => []);
  const res = await GoogleSheetGetOne({ request: {}, connection: {} });
  expect(res).toEqual(null);
});

test('googleSheetGetOne, limit', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({ request: { options: { limit: 2 } }, connection: {} });
  expect(res).toEqual({
    _rowNumber: 2,
    _rawData: ['1', 'John', '34', '2020/04/26', 'TRUE'],
    id: '1',
    name: 'John',
    age: '34',
    birth_date: '2020/04/26',
    married: 'TRUE',
  });
});

test('googleSheetGetOne, skip', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({ request: { options: { skip: 2 } }, connection: {} });
  expect(res).toEqual({
    _rowNumber: 4,
    _rawData: ['3', 'Tim', '34', '2020/04/28', 'FALSE'],
    id: '3',
    name: 'Tim',
    age: '34',
    birth_date: '2020/04/28',
    married: 'FALSE',
  });
});

test('googleSheetGetOne, skip and limit', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({
    request: { options: { skip: 2, limit: 1 } },
    connection: {},
  });
  expect(res).toEqual({
    _rowNumber: 4,
    _rawData: ['3', 'Tim', '34', '2020/04/28', 'FALSE'],
    id: '3',
    name: 'Tim',
    age: '34',
    birth_date: '2020/04/28',
    married: 'FALSE',
  });
});

test('googleSheetGetOne, filter', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({ request: { filter: { name: 'Tim' } }, connection: {} });
  expect(res).toEqual({
    _rowNumber: 4,
    _rawData: ['3', 'Tim', '34', '2020/04/28', 'FALSE'],
    id: '3',
    name: 'Tim',
    age: '34',
    birth_date: '2020/04/28',
    married: 'FALSE',
  });
});

test('googleSheetGetOne, limit before filter', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({
    request: { filter: { name: 'Tim' }, options: { limit: 2 } },
    connection: {},
  });
  expect(res).toEqual(null);
});

test('googleSheetGetOne, skip before filter', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({
    request: { filter: { married: 'TRUE' }, options: { skip: 2 } },
    connection: {},
  });
  expect(res).toEqual({
    _rowNumber: 5,
    _rawData: ['4', 'Craig', '21', '2020-04-25T22:00:00.000Z', 'TRUE'],
    id: '4',
    name: 'Craig',
    age: '120',
    birth_date: '2020-04-25T22:00:00.000Z',
    married: 'TRUE',
  });
});

test('googleSheetGetOne, filter filters all', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({ request: { filter: { name: 'Nobody' } }, connection: {} });
  expect(res).toEqual(null);
});

test('googleSheetGetOne, filter _rowNumber', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({
    request: { filter: { _rowNumber: { $gt: 3 } } },
    connection: {},
  });
  expect(res).toEqual({
    _rowNumber: 4,
    _rawData: ['3', 'Tim', '34', '2020/04/28', 'FALSE'],
    id: '3',
    name: 'Tim',
    age: '34',
    birth_date: '2020/04/28',
    married: 'FALSE',
  });
});

test('googleSheetGetOne, columnTypes', async () => {
  mockGetRows.mockImplementation(mockGetRowsDefaultImp);
  const res = await GoogleSheetGetOne({
    request: {},
    connection: {
      columnTypes: {
        name: 'string',
        age: 'number',
        married: 'boolean',
        birth_date: 'date',
      },
    },
  });
  expect(res).toEqual({
    _rowNumber: 2,
    _rawData: ['1', 'John', '34', '2020/04/26', 'TRUE'],
    id: '1',
    name: 'John',
    age: 34,
    birth_date: new Date('2020-04-26T00:00:00.000Z'),
    married: true,
  });
});

test('valid request schema', () => {
  const request = {};
  expect(validate({ schema, data: request })).toEqual({ valid: true });
});

test('valid request schema, all properties', () => {
  const request = {
    options: {
      limit: 100,
      skip: 300,
    },
  };
  expect(validate({ schema, data: request })).toEqual({ valid: true });
});

test('request properties is not an object', () => {
  const request = 'request';
  expect(() => validate({ schema, data: request })).toThrow(
    'GoogleSheetGetOne request properties should be an object.'
  );
});

test('limit is not a number', () => {
  const request = {
    options: {
      limit: true,
    },
  };
  expect(() => validate({ schema, data: request })).toThrow(
    'GoogleSheetGetOne request property "options.limit" should be a number.'
  );
});

test('skip is not a number', () => {
  const request = {
    options: {
      skip: true,
    },
  };
  expect(() => validate({ schema, data: request })).toThrow(
    'GoogleSheetGetOne request property "options.skip" should be a number.'
  );
});

test('filter is not an object', () => {
  const request = {
    filter: true,
  };
  expect(() => validate({ schema, data: request })).toThrow(
    'GoogleSheetGetOne request property "filter" should be an object.'
  );
});

test('checkRead should be true', async () => {
  expect(checkRead).toBe(true);
});

test('checkWrite should be false', async () => {
  expect(checkWrite).toBe(false);
});
