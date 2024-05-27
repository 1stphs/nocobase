/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { BaseInterface } from './base-interface';
import { getDefaultFormat, str2moment } from '@nocobase/utils';

export class DatetimeInterface extends BaseInterface {
  toString(value: any, ctx?: any) {
    const utcOffset = ctx.get('X-Timezone');
    const props = this.options?.uiSchema?.['x-component-props'] ?? {};
    const format = getDefaultFormat(props);
    const m = str2moment(value, { ...props, utcOffset });
    return m ? m.format(format) : '';
  }
}