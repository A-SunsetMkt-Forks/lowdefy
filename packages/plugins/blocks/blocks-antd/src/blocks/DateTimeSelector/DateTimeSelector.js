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
import { DatePicker } from 'antd';
import moment from 'moment';
import { type } from '@lowdefy/helpers';
import { blockDefaultProps } from '@lowdefy/block-utils';

import Label from '../Label/Label.js';
import disabledDate from '../../disabledDate.js';

const DateTimeSelector = ({
  blockId,
  components: { Icon },
  events,
  loading,
  methods,
  properties,
  required,
  validation,
  value,
}) => {
  const timeUnit = !type.isString(properties.timeFormat)
    ? 'minute'
    : properties.timeFormat === 'HH:mm:ss'
    ? 'second'
    : properties.timeFormat === 'HH'
    ? 'hour'
    : 'minute';
  return (
    <Label
      blockId={blockId}
      components={{ Icon }}
      events={events}
      properties={{ title: properties.title, size: properties.size, ...properties.label }}
      validation={validation}
      required={required}
      content={{
        content: () => (
          <div className={methods.makeCssClass({ width: '100%' })}>
            <div id={`${blockId}_popup`} />
            <DatePicker
              id={`${blockId}_input`}
              allowClear={properties.allowClear !== false}
              autoFocus={properties.autoFocus}
              bordered={properties.bordered}
              className={methods.makeCssClass([{ width: '100%' }, properties.inputStyle])}
              disabled={properties.disabled || loading}
              disabledDate={disabledDate(properties.disabledDates)}
              format={properties.format || 'YYYY-MM-DD HH:mm'}
              getPopupContainer={() => document.getElementById(`${blockId}_popup`)}
              placeholder={properties.placeholder || 'Select Date & Time'}
              showNow={properties.showNow}
              showToday={properties.showToday}
              size={properties.size}
              status={validation.status}
              suffixIcon={
                properties.suffixIcon && (
                  <Icon
                    blockId={`${blockId}_suffixIcon`}
                    events={events}
                    properties={properties.suffixIcon}
                  />
                )
              }
              showTime={{
                format: properties.timeFormat || 'HH:mm',
                hourStep: properties.hourStep || 1,
                minuteStep: properties.minuteStep || 5,
                secondStep: properties.secondStep || 30,
              }}
              onChange={(newVal) => {
                methods.setValue(
                  !newVal
                    ? null
                    : moment
                        .utc(newVal.add(properties.selectUTC ? newVal.utcOffset() : 0, 'minutes'))
                        .startOf(timeUnit)
                        .toDate()
                );
                methods.triggerEvent({ name: 'onChange' });
              }}
              value={
                !type.isDate(value)
                  ? null
                  : properties.selectUTC
                  ? moment.utc(value)
                  : moment(value)
              }
            />
          </div>
        ),
      }}
    />
  );
};

DateTimeSelector.defaultProps = blockDefaultProps;
DateTimeSelector.meta = {
  valueType: 'date',
  category: 'input',
  icons: [...Label.meta.icons, 'AiOutlineCalendar'],
  styles: ['blocks/DateTimeSelector/style.less'],
};

export default DateTimeSelector;
