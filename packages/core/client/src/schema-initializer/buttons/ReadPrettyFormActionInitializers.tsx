import { useCollection } from '../..';
import { SchemaInitializerV2 } from '../../application';

const useVisibleCollection = () => {
  const collection = useCollection();
  return (collection.template !== 'view' || collection?.writableView) && collection.template !== 'sql';
};
// 表单的操作配置
export const ReadPrettyFormActionInitializers = {
  'data-testid': 'configure-actions-button-of-read-pretty-form',
  title: '{{t("Configure actions")}}',
  icon: 'SettingOutlined',
  style: {
    marginLeft: 8,
  },
  items: [
    {
      type: 'itemGroup',
      title: '{{t("Enable actions")}}',
      children: [
        {
          type: 'item',
          title: '{{t("Edit")}}',
          component: 'UpdateActionInitializer',
          schema: {
            'x-component': 'Action',
            'x-decorator': 'ACLActionProvider',
            'x-component-props': {
              type: 'primary',
            },
          },
          visible: useVisibleCollection,
        },
        {
          type: 'item',
          title: '{{t("Delete")}}',
          component: 'DestroyActionInitializer',
          schema: {
            'x-component': 'Action',
            'x-decorator': 'ACLActionProvider',
          },
          visible: useVisibleCollection,
        },
        {
          type: 'item',
          title: '{{t("Duplicate")}}',
          component: 'DuplicateActionInitializer',
          schema: {
            'x-component': 'Action',
            'x-action': 'duplicate',
            'x-decorator': 'ACLActionProvider',
            'x-component-props': {
              type: 'primary',
            },
          },
          visible: useVisibleCollection,
        },
        {
          type: 'item',
          title: '{{t("Print")}}',
          component: 'PrintActionInitializer',
          schema: {
            'x-component': 'Action',
          },
        },
      ],
    },

    {
      type: 'divider',
    },
    {
      type: 'subMenu',
      title: '{{t("Customize")}}',
      children: [
        {
          type: 'item',
          title: '{{t("Popup")}}',
          component: 'CustomizeActionInitializer',
          schema: {
            type: 'void',
            title: '{{ t("Popup") }}',
            'x-action': 'customize:popup',
            'x-designer': 'Action.Designer',
            'x-component': 'Action',
            'x-component-props': {
              openMode: 'drawer',
            },
            properties: {
              drawer: {
                type: 'void',
                title: '{{ t("Popup") }}',
                'x-component': 'Action.Container',
                'x-component-props': {
                  className: 'nb-action-popup',
                },
                properties: {
                  tabs: {
                    type: 'void',
                    'x-component': 'Tabs',
                    'x-component-props': {},
                    'x-initializer': 'TabPaneInitializers',
                    properties: {
                      tab1: {
                        type: 'void',
                        title: '{{t("Details")}}',
                        'x-component': 'Tabs.TabPane',
                        'x-designer': 'Tabs.Designer',
                        'x-component-props': {},
                        properties: {
                          grid: {
                            type: 'void',
                            'x-component': 'Grid',
                            'x-initializer': 'RecordBlockInitializers',
                            properties: {},
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          type: 'item',
          title: '{{t("Update record")}}',
          component: 'CustomizeActionInitializer',
          schema: {
            title: '{{ t("Update record") }}',
            'x-component': 'Action',
            'x-designer': 'Action.Designer',
            'x-action': 'customize:update',
            'x-decorator': 'ACLActionProvider',
            'x-acl-action': 'update',
            'x-action-settings': {
              assignedValues: {},
              onSuccess: {
                manualClose: true,
                redirecting: false,
                successMessage: '{{t("Updated successfully")}}',
              },
            },
            'x-component-props': {
              useProps: '{{ useCustomizeUpdateActionProps }}',
            },
          },
          visible: useVisibleCollection,
        },
        {
          type: 'item',
          title: '{{t("Custom request")}}',
          component: 'CustomRequestInitializer',
          visible: useVisibleCollection,
        },
      ],
    },
  ],
};

export const readPrettyFormActionInitializers = new SchemaInitializerV2({
  name: 'ReadPrettyFormActionInitializers',
  'data-testid': 'configure-actions-button-of-read-pretty-form',
  title: '{{t("Configure actions")}}',
  icon: 'SettingOutlined',
  style: {
    marginLeft: 8,
  },
  items: [
    {
      type: 'itemGroup',
      name: 'enable-actions',
      title: '{{t("Enable actions")}}',
      children: [
        {
          title: '{{t("Edit")}}',
          name: 'edit',
          Component: 'UpdateActionInitializer',
          schema: {
            'x-component': 'Action',
            'x-decorator': 'ACLActionProvider',
            'x-component-props': {
              type: 'primary',
            },
          },
          useVisible: useVisibleCollection,
        },
        {
          title: '{{t("Delete")}}',
          name: 'delete',
          Component: 'DestroyActionInitializer',
          schema: {
            'x-component': 'Action',
            'x-decorator': 'ACLActionProvider',
          },
          useVisible: useVisibleCollection,
        },
        {
          title: '{{t("Duplicate")}}',
          name: 'duplicate',
          Component: 'DuplicateActionInitializer',
          schema: {
            'x-component': 'Action',
            'x-action': 'duplicate',
            'x-decorator': 'ACLActionProvider',
            'x-component-props': {
              type: 'primary',
            },
          },
          useVisible: useVisibleCollection,
        },
        {
          title: '{{t("Print")}}',
          name: 'print',
          Component: 'PrintActionInitializer',
          schema: {
            'x-component': 'Action',
          },
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      type: 'subMenu',
      name: 'customize',
      title: '{{t("Customize")}}',
      children: [
        {
          name: 'popup',
          title: '{{t("Popup")}}',
          Component: 'CustomizeActionInitializer',
          schema: {
            type: 'void',
            title: '{{ t("Popup") }}',
            'x-action': 'customize:popup',
            'x-designer': 'Action.Designer',
            'x-component': 'Action',
            'x-component-props': {
              openMode: 'drawer',
            },
            properties: {
              drawer: {
                type: 'void',
                title: '{{ t("Popup") }}',
                'x-component': 'Action.Container',
                'x-component-props': {
                  className: 'nb-action-popup',
                },
                properties: {
                  tabs: {
                    type: 'void',
                    'x-component': 'Tabs',
                    'x-component-props': {},
                    'x-initializer': 'TabPaneInitializers',
                    properties: {
                      tab1: {
                        type: 'void',
                        title: '{{t("Details")}}',
                        'x-component': 'Tabs.TabPane',
                        'x-designer': 'Tabs.Designer',
                        'x-component-props': {},
                        properties: {
                          grid: {
                            type: 'void',
                            'x-component': 'Grid',
                            'x-initializer': 'RecordBlockInitializers',
                            properties: {},
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        {
          name: 'update-record',
          title: '{{t("Update record")}}',
          Component: 'CustomizeActionInitializer',
          schema: {
            title: '{{ t("Update record") }}',
            'x-component': 'Action',
            'x-designer': 'Action.Designer',
            'x-action': 'customize:update',
            'x-decorator': 'ACLActionProvider',
            'x-acl-action': 'update',
            'x-action-settings': {
              assignedValues: {},
              onSuccess: {
                manualClose: true,
                redirecting: false,
                successMessage: '{{t("Updated successfully")}}',
              },
            },
            'x-component-props': {
              useProps: '{{ useCustomizeUpdateActionProps }}',
            },
          },
          visible: useVisibleCollection,
        },
        {
          name: 'custom-request',
          title: '{{t("Custom request")}}',
          Component: 'CustomRequestInitializer',
          useVisible: useVisibleCollection,
        },
      ],
    },
  ],
});
