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

import React, { useState, useEffect } from 'react';
import { TreeSelect } from 'antd';
import { blockDefaultProps, renderHtml } from '@lowdefy/block-utils';
import Label from '@lowdefy/blocks-antd/blocks/Label/Label.js';
import { type } from '@lowdefy/helpers';

const transformDataToTreeOptions = ({ data, methods, properties }) => {
  const uniqueIds = new Set();
  const uniqueData = data.filter((item) => {
    if (uniqueIds.has(item.id)) {
      return false;
    }
    uniqueIds.add(item.id);
    return true;
  });

  const treeDataOptions = uniqueData.map((item) => {
    return {
      title: renderHtml({ html: item.label, methods }),
      label: item.label,
      tagLabel: type.isString(item.tag)
        ? renderHtml({ html: item.tag, methods })
        : renderHtml({ html: item.label, methods }),
      filterValue: item.label,
      value: item.value || item.id,
      id: item.id,
      parentId: item.parentId || null,
      disabled: !!properties.disabled || !!item.disabled || false,
      selectable: !(properties.selectable === false || item.selectable === false || false),
    };
  });

  const treeDataMap = uniqueData.reduce((acc, item) => {
    acc[item.id] = { value: item.value, id: item.id };
    return acc;
  }, {});

  return { treeDataOptions, treeDataMap };
};

const TreeMultipleSelector = ({ blockId, methods, properties, required, validation, value }) => {
  const [selectedValue, setSelectedValue] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [treeDataMap, setTreeDataMap] = useState([]);

  useEffect(() => {
    if (!properties.useSetData) {
      const { treeDataOptions, treeDataMap } = transformDataToTreeOptions({
        data: properties.options,
        methods,
        properties,
      });
      setTreeData(treeDataOptions);
      setTreeDataMap(treeDataMap);
    }
  }, [JSON.stringify(properties.options)]);

  useEffect(() => {
    if (properties.useSetData === true) {
      methods.registerMethod('setData', (data) => {
        if (!type.isArray(data)) {
          throw new Error('setData method requires an array.');
        }
        const { treeDataOptions, treeDataMap } = transformDataToTreeOptions({
          data,
          methods,
          properties,
        });
        setTreeData(treeDataOptions);
        setTreeDataMap(treeDataMap);
      });
      methods.triggerEvent({ name: 'onReady' });
    }
  }, []);

  useEffect(() => {
    if (type.isNone(value) || !type.isArray(value)) {
      setSelectedValue([]);
    } else {
      setSelectedValue(value);
    }
  }, [value]);

  const onChange = (newSelectedValues) => {
    const selectedValues = newSelectedValues.map((id) => treeDataMap[id]?.value).filter(Boolean);
    methods.setValue(selectedValues);
    setSelectedValue(newSelectedValues);
  };

  const onSearch = (searchValue) => {
    if (searchValue === '' || type.isNone(searchValue)) {
      return;
    }
    methods.triggerEvent({ name: 'onSearch', event: { searchValue } });
  };

  return (
    <Label
      blockId={blockId}
      properties={{ title: properties.title, size: properties.size, ...properties.label }}
      required={required}
      validation={validation}
      content={{
        content: () => (
          <TreeSelect
            showSearch
            value={selectedValue}
            style={{ width: '100%' }}
            dropdownStyle={{
              maxHeight: 400,
              overflow: 'auto',
              ...(properties.dropdownStyle || {}),
            }}
            placeholder={properties.placeholder}
            multiple
            treeDefaultExpandAll={properties.treeDefaultExpandAll || false}
            onChange={onChange}
            treeData={treeData}
            onSearch={onSearch}
            treeDataSimpleMode={{ pId: 'parentId' }}
            treeNodeFilterProp={properties.treeNodeFilterProp || 'filterValue'}
            autoClearSearchValue={properties.autoClearSearchValue || false}
            disabled={properties.disabled || false}
            treeNodeLabelProp="tagLabel"
          />
        ),
      }}
    />
  );
};

TreeMultipleSelector.defaultProps = blockDefaultProps;
TreeMultipleSelector.meta = {
  category: 'input',
  valueType: 'array',
  icons: [],
  styles: ['blocks/TreeMultipleSelector/style.less'],
};

export default TreeMultipleSelector;
