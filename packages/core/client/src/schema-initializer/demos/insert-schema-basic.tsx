import React from 'react';
import {
  Application,
  Plugin,
  SchemaComponent,
  SchemaComponentProvider,
  SchemaInitializerV2,
  useApp,
  useSchemaInitializerV2,
} from '@nocobase/client';
import { observer, useField } from '@formily/react';
import { Field } from '@formily/core';

const Hello = observer(() => {
  const field = useField<Field>();
  return (
    <div style={{ marginBottom: 20, padding: '0 20px', height: 50, lineHeight: '50px', background: '#f1f1f1' }}>
      {field.title}
    </div>
  );
});

function Demo({ title }) {
  // 调用插入功能
  const { insert } = useSchemaInitializerV2();
  const handleClick = () => {
    insert({
      type: 'void',
      title,
      'x-component': 'Hello',
    });
  };
  return <div onClick={handleClick}>{title}</div>;
}

const myInitializer = new SchemaInitializerV2({
  title: 'Add Block',
  // 插入位置
  insertPosition: 'beforeBegin',
  items: [
    {
      name: 'a',
      title: 'Item A',
      Component: Demo,
    },
    {
      name: 'b',
      title: 'Item B',
      Component: Demo,
    },
  ],
});

const AddBlockButton = observer(() => {
  const app = useApp();
  const element = app.schemaInitializerManager.render('MyInitializer');
  return element;
});

const Root = () => {
  return (
    <div>
      <SchemaComponentProvider designable>
        <SchemaComponent
          components={{ Hello, AddBlockButton }}
          schema={{
            type: 'void',
            name: 'page',
            'x-component': 'div',
            properties: {
              hello1: {
                type: 'void',
                title: 'Test1',
                'x-component': 'Hello',
              },
              hello2: {
                type: 'void',
                title: 'Test2',
                'x-component': 'Hello',
              },
              initializer: {
                type: 'void',
                'x-component': 'AddBlockButton',
              },
            },
          }}
        ></SchemaComponent>
      </SchemaComponentProvider>
    </div>
  );
};

class MyPlugin extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add('MyInitializer', myInitializer);
    this.app.router.add('root', {
      path: '/',
      Component: Root,
    });
  }
}

const app = new Application({
  router: {
    type: 'memory',
    initialEntries: ['/'],
  },
  plugins: [MyPlugin],
});

export default app.getRootComponent();
