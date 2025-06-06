import { NotificationsConsumer } from './notifications.consumer';
import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsConsumer', () => {
  let consumer: NotificationsConsumer;
  let gateway: NotificationsGateway;

  beforeEach(() => {
    gateway = { notifyAll: jest.fn() } as any;
    consumer = new NotificationsConsumer(gateway);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should forward notification to gateway', () => {
    const data = { message: 'new comment' };
    consumer.handleNewNotification(data);
    expect(gateway.notifyAll).toHaveBeenCalledWith(data);
  });
});