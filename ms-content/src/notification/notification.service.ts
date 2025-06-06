import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  notify(contentId: string, text: string) {
    const payload = {
      type: 'new-comment',
      contentId,
      message: `📝 Comentario nuevo: ${text}`,
      timestamp: new Date().toISOString(),
    };
    this.client.emit('notifications.new', JSON.stringify(payload));
  }
}