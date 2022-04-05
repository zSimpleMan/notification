import { UseGuards } from '@nestjs/common';
import {
    ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthSocketGuard } from '../guards/auth-socket.guard';
@WebSocketGateway({
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials:true
  },
  allowEIO3: true,
  namespace: 'notification'
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(AuthSocketGuard)
  @SubscribeMessage('join-room')
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string): Promise<WsResponse<any>> {
    const room = roomName.trim()

    client.join(room)
    // client.emit('create-room', 'created room success!')
    console.log(`join room ${roomName} success on Port = ${process.env.PORT}`)
    return {
      event: 'join-room-respond',
      data: `join room '${room}' success`
    }
  }

  @SubscribeMessage('leave')
  async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string): Promise<WsResponse<any>> {
    client.leave(roomId)
    // client.emit('create-room', 'created room success!')
    return {
      event: 'leave-room',
      data: 'leave success'
    }
  }

  async sendNoti (data) {
    try {
      // const dt = JSON.parse(msg)
      this.server.to(data.room).emit('notification', data.message)
      // console.log(this.server._nsps['notification'].ad)
    } catch (err) {
      console.log(err)
    }
    return 'success'
  }

  async handleConnection(client: Socket) {
    console.log('connected');
    // I can see this message in console
  }

    async handleDisconnect(client: Socket) {
    console.log('disconnected');
     // I can see this message in console
  }
}