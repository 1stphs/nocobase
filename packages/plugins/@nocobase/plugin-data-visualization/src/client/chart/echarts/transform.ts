/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import * as echarts from 'echarts';
import { RenderProps } from '../chart';

echarts.registerTransform({
  type: 'data-visualization:transform',
  transform: function (params: any) {
    const fieldProps = params.config.fieldProps as RenderProps['fieldProps'];
    const data = params.upstream.cloneRawData();
    return {
      data: data.map((row: any) => {
        Object.entries(fieldProps).forEach(([key, props]) => {
          if (props.transformer) {
            row[key] = props.transformer(row[key]);
          }
        });
        return row;
      }),
    };
  } as any,
});

echarts.registerTransform({
  type: 'data-visualization:toSeries',
  transform: function (params: any) {
    const data = params.upstream.cloneRawData();
    const { xField, yField, seriesField } = params.config || {};
    if (!seriesField) {
      return { data };
    }
    const dataMap = data.reduce((map: any, row: any) => {
      if (!map[row[xField]]) {
        map[row[xField]] = { [row[seriesField]]: row[yField] };
        return map;
      }
      map[row[xField]][row[seriesField]] = row[yField];
      return map;
    }, {});
    const result = Object.entries(dataMap).map(([key, value]: any) => {
      return {
        [xField]: key,
        ...value,
      };
    });
    return {
      data: result,
    };
  },
});
