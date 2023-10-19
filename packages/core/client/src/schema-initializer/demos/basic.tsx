import React from 'react';
import { Application, Plugin, SchemaInitializerV2, useApp } from '@nocobase/client';

const myInitializer = new SchemaInitializerV2({
  name: 'MyInitializer',
  // 正常情况下这个值为 false，通过点击页面左上角的设计按钮切换，这里为了显示设置为 true
  designable: true,
  //  按钮标题标题
  title: 'Button Text',
  // 调用 initializer.render() 时会渲染 items 列表
  items: [
    {
      name: 'demo1', // 唯一标识
      Component: () => <div>myInitializer content</div>, // 渲染组件
    },
    {
      name: 'demo2',
      Component: () => <div>myInitializer content 2</div>,
    },
  ],
});

const Root = () => {
  const app = useApp();
  // 渲染 schema initializer
  const element = app.schemaInitializerManager.render('MyInitializer');
  return <div>{element}</div>;
};

class MyPlugin extends Plugin {
  async load() {
    // 注册 schema initializer
    this.app.schemaInitializerManager.add(myInitializer);
    // 注册路由
    this.app.router.add('root', {
      path: '/',
      Component: Root,
    });
  }
}

class MyPlugin2 extends Plugin {
  async load() {
    const myInitializer = this.app.schemaInitializerManager.get('MyInitializer');

    // 添加或者修改 schema initializer 的 items
    myInitializer.add('demo3', {
      Component: () => <div>myInitializer content3</div>,
    });

    // 移除 demo2
    myInitializer.remove('demo2');
  }
}

const app = new Application({
  router: {
    type: 'memory',
    initialEntries: ['/'],
  },
  plugins: [MyPlugin, MyPlugin2],
});

export default app.getRootComponent();
