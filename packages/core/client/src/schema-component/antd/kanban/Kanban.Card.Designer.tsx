import { MenuOutlined } from '@ant-design/icons';
import { ISchema, useFieldSchema } from '@formily/react';
import { uid } from '@formily/shared';
import { Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAPIClient } from '../../../api-client';
import { createDesignable, useDesignable } from '../../../schema-component';
import {
  useAssociatedFormItemInitializerFields,
  useFormItemInitializerFields,
} from '../../../schema-initializer/utils';
import { OpenModeSchemaItems } from '../../../schema-items';
import { SchemaInitializerV2, useApp } from '../../../application';

const gridRowColWrap = (schema: ISchema) => {
  schema['x-read-pretty'] = true;
  return {
    type: 'void',
    'x-component': 'Grid.Row',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Grid.Col',
        properties: {
          [schema.name || uid()]: schema,
        },
      },
    },
  };
};

// export const removeGridFormItem = (schema, cb) => {
//   cb(schema, {
//     removeParentsIfNoChildren: true,
//     breakRemoveOn: {
//       'x-component': 'Kanban.Card',
//     },
//   });
// };

export const KanbanCardDesigner = () => {
  const { designable } = useDesignable();
  const app = useApp();
  if (!designable) {
    return null;
  }
  const element = app.schemaInitializerManager.render('KanbanCardInitializers');
  return (
    <div className={'general-schema-designer'}>
      <div className={'general-schema-designer-icons'}>
        <Space size={2} align={'center'}>
          {element}
        </Space>
      </div>
    </div>
  );
};

export const kanbanCardInitializers = new SchemaInitializerV2({
  name: 'KanbanCardInitializers',
  wrap: gridRowColWrap,
  useInsert() {
    const fieldSchema = useFieldSchema();
    const { t } = useTranslation();
    const api = useAPIClient();
    const { refresh } = useDesignable();

    return (schema) => {
      const gridSchema = fieldSchema.reduceProperties((buf, schema) => {
        if (schema['x-component'] === 'Grid') {
          return schema;
        }
        return buf;
      }, null);

      if (!gridSchema) {
        return;
      }

      const dn = createDesignable({
        t,
        api,
        refresh,
        current: gridSchema,
      });
      dn.loadAPIClientEvents();
      dn.insertBeforeEnd(schema);
    };
  },
  Component: () => <MenuOutlined style={{ cursor: 'pointer', fontSize: 12 }} />,
  items: [
    {
      type: 'itemGroup',
      title: '{{t("Display fields")}}',
      name: 'display-fields',
      useChildren() {
        const fields = useFormItemInitializerFields({
          readPretty: true,
          block: 'Kanban',
        });
        return fields;
      },
    },
    {
      type: 'itemGroup',
      divider: true,
      title: '{{t("Display association fields")}}',
      name: 'display-association-fields',
      useVisible() {
        const associationFields = useAssociatedFormItemInitializerFields({ readPretty: true, block: 'Kanban' });
        return associationFields.length > 0;
      },
      useChildren() {
        const associationFields = useAssociatedFormItemInitializerFields({ readPretty: true, block: 'Kanban' });
        return associationFields;
      },
    },
    {
      type: 'divider',
    },
    {
      title: '{{t("Display field title")}}',
      name: 'display-field-title',
      Component: 'Kanban.Card.Designer.TitleSwitch',
      enable: true,
    },
    {
      name: 'open-mode',
      Component: OpenModeSchemaItems,
    },
  ],
});
