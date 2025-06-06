import { NotificationsGateway } from './notifications.gateway';

describe('NotificationsGateway', () => {
  let gateway: NotificationsGateway;

  beforeEach(() => {
    gateway = new NotificationsGateway();
    gateway.server = {
      emit: jest.fn(),
    } as any;
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should emit notification via WebSocket', () => {
    const data = { message: 'test' };
    gateway.notifyAll(data);
    expect(gateway.server.emit).toHaveBeenCalledWith('notification', data);
  });
});