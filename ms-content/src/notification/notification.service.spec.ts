import { NotificationService } from './notification.service';
import { ClientProxy } from '@nestjs/microservices';

describe('NotificationService', () => {
  let service: NotificationService;
  let client: jest.Mocked<ClientProxy>;

  beforeEach(() => {
    client = {
      emit: jest.fn(),
    } as any;

    service = new NotificationService(client);
  });

  it('notify should emit message', () => {
    service.notify('123', 'texto');
    expect(client.emit).toHaveBeenCalledWith(
      'notifications.new',
      expect.any(String),
    );
  });
});
