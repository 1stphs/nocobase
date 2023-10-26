import React from 'react';
import { Application, Plugin, SchemaInitializer, useApp } from '@nocobase/client';

const myInitializer = new SchemaInitializer({
  name: 'MyInitializer',
  designable: true,
  title: 'Button Text',
  items: [
    {
      name: 'a',
      type: 'itemGroup',
      title: 'Group a',
      // 动态加载子项
      useChildren() {
        return [
          {
            name: 'a-1',
            type: 'item',
            title: 'A 1',
            onClick: () => {
              alert('a-1');
            },
          },
          {
            name: 'a-2',
            type: 'item',
            title: 'A 2',
          },
        ];
      },
    },
    {
      type: 'divider',
    },
    {
      name: 'b',
      type: 'item',
      title: 'Item B',
      useVisible() {
        return false;
      },
    },
    {
      name: 'c',
      type: 'item',
      title: 'Item C',
      useVisible() {
        return true;
      },
    },
  ],
});

const Root = () => {
  const app = useApp();
  const initializer = app.schemaInitializerManager.get('MyInitializer');
  return <div>{initializer.render()}</div>;
};

class MyPlugin extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(myInitializer);
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
