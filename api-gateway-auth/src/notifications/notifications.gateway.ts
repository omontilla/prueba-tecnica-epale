import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('WebSocket Gateway iniciado');
  }

  notifyAll(data: any) {
    console.log('📡 Enviando notificación vía WebSocket:', data);
    this.server.emit('notification', data);
  }
}