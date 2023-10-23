import { useField, useFieldSchema } from '@formily/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCollection } from '../../collection-manager';
import { useCompile } from '../../schema-component';
import { SchemaInitializer } from '../SchemaInitializer';
import {
  itemsMerge,
  useAssociatedTableColumnInitializerFields,
  useInheritsTableColumnInitializerFields,
  useTableColumnInitializerFields,
} from '../utils';
import { SchemaInitializerChildren, SchemaInitializerV2 } from '../../application';

// 表格列配置
const ParentCollectionFields = () => {
  const inheritFields = useInheritsTableColumnInitializerFields();
  const { t } = useTranslation();
  const compile = useCompile();
  if (!inheritFields?.length) return null;
  const res = [];
  inheritFields.forEach((inherit) => {
    Object.values(inherit)[0].length &&
      res.push({
        type: 'itemGroup',
        divider: true,
        title: t(`Parent collection fields`) + '(' + compile(`${Object.keys(inherit)[0]}`) + ')',
        children: Object.values(inherit)[0].filter((v: any) => !v?.field?.isForeignKey),
      });
  });
  return <SchemaInitializerChildren>{res}</SchemaInitializerChildren>;
};

const AssociatedFields = () => {
  const associatedFields = useAssociatedTableColumnInitializerFields();
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();

  if (!associatedFields?.length || fieldSchema['x-component'] === 'AssociationField.SubTable') return null;
  // TODO: 修改类型
  const schema: any = [
    {
      type: 'itemGroup',
      title: t('Display association fields'),
      children: associatedFields,
    },
  ];
  return <SchemaInitializerChildren>{schema}</SchemaInitializerChildren>;
};

export const tableColumnInitializers = new SchemaInitializerV2({
  name: 'TableColumnInitializers',
  'data-testid': 'configure-columns-button-of-table-block',
  insertPosition: 'beforeEnd',
  icon: 'SettingOutlined',
  title: '{{t("Configure columns")}}',
  wrap: (s) => {
    if (s['x-action-column']) {
      return s;
    }
    return {
      type: 'void',
      'x-decorator': 'TableV2.Column.Decorator',
      'x-designer': 'TableV2.Column.Designer',
      'x-component': 'TableV2.Column',
      properties: {
        [s.name]: {
          ...s,
        },
      },
    };
  },
  items: [
    {
      name: 'display-fields',
      type: 'itemGroup',
      title: '{{t("Display fields")}}',
      // children: DisplayFields,
      useChildren: useTableColumnInitializerFields,
    },
    {
      name: 'parent-collection-fields',
      Component: ParentCollectionFields,
    },
    {
      name: 'association-fields',
      Component: AssociatedFields,
    },
    {
      type: 'divider',
    },
    {
      type: 'item',
      name: 'add',
      title: '{{t("Action column")}}',
      Component: 'TableActionColumnInitializer',
    },
  ],
});
