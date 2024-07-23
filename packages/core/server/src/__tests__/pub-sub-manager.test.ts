/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import { createMockServer, MockServer } from '@nocobase/test';
import { createClient } from 'redis';
import Plugin from '../plugin';
import { IPubSubAdapter } from '../pub-sub-manager';

export class RedisPubSubAdapter implements IPubSubAdapter {
  publisher;
  subscriber;

  constructor() {
    this.publisher = createClient();
    this.subscriber = this.publisher.duplicate();
  }

  async connect() {
    await this.publisher.connect();
    await this.subscriber.connect();
  }

  async close() {
    await this.publisher.disconnect();
    await this.subscriber.disconnect();
  }

  async subscribe(channel, callback) {
    return this.subscriber.subscribe(channel, callback, true);
  }

  async unsubscribe(channel, callback) {
    return this.subscriber.unsubscribe(channel, callback, true);
  }

  async publish(channel, message) {
    return this.publisher.publish(channel, message);
  }

  onMessage(callback) {}
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('pub-sub-manager', () => {
  test('case1', async () => {
    let count = 0;
    class Plugin1 extends Plugin {
      async beforeLoad() {
        this.app.pubSubManager.setAdapter(new RedisPubSubAdapter());
        await this.app.pubSubManager.subscribe('chan1nel', (message) => {
          ++count;
          console.log(`Channel1 subscriber collected message: ${message}`);
        });
      }
    }
    const appOpts = {
      pubSubManager: {
        name: 'app1',
      },
      plugins: [Plugin1, 'nocobase'],
    };
    const node1: MockServer = await createMockServer({
      ...appOpts,
      name: 'node1',
    });
    const node2: MockServer = await createMockServer({
      ...appOpts,
      name: 'node2',
    });
    await node1.pubSubManager.publish('chan1nel', `channel1_message_1`);
    await sleep(1000);
    expect(count).toBe(2);
    await node1.destroy();
    await node2.destroy();
  });
});