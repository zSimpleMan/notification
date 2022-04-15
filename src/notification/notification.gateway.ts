import { ExecutionContext, UseGuards } from '@nestjs/common';
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
import { NotificationService } from './notification.service';
import { SOCKET_CHANELS } from '../share/types'
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
  constructor (
    private readonly notificationService: NotificationService
  ) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(AuthSocketGuard)
  @SubscribeMessage(SOCKET_CHANELS.joinRoom)
  async joinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string): Promise<WsResponse<any>> {
    const room = roomName.trim()

    client.join(room)
    // client.emit('create-room', 'created room success!')
    console.log(`join room ${roomName} success on Port = ${process.env.PORT}`)
    return {
      event: SOCKET_CHANELS.joinRoomResponse,
      data: `join room '${room}' success`
    }
  }

  @SubscribeMessage(SOCKET_CHANELS.leaveRoom)
  async leaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string): Promise<WsResponse<any>> {
    client.leave(roomId)
    // client.emit('create-room', 'created room success!')
    return {
      event: SOCKET_CHANELS.leaveRoomResponse,
      data: 'leave success'
    }
  }

  async sendNoti (data) {
    try {
      // const dt = JSON.parse(msg)
      this.server.to(data.room).emit(SOCKET_CHANELS.notification, data.message)
    } catch (err) {
      console.log(err)
    }
    return 'success'
  }

  @SubscribeMessage(SOCKET_CHANELS.getRooms)
  async getRooms(@ConnectedSocket() client: Socket): Promise<WsResponse<any>> {
    const rooms = []

    for (const [key, value] of client.rooms.entries()) {
      rooms.push(value)
    }

    return {
      event: SOCKET_CHANELS.getRoomsResponse,
      data: rooms
    }
  }

  // @UseGuards(AuthSocketGuard)
  async handleConnection(client: Socket) {
    let user
    try {
      user = await this.notificationService.verify(client.handshake.headers.authorization.split(' ')[1])
    } catch (err) {
      client.emit(SOCKET_CHANELS.exception, err)
      return
    }

    if (user.id) {
      client.join(`room-user-${user.id}`)
    }
    if (user.originalAccount.brandId) {
      client.join(`room-brand-${user.originalAccount.brandId}`)
    }
    if (user.originalAccount.companyId) {
      client.join(`room-company-${user.originalAccount.companyId}`)
    }

    client.join(`room-general`)

    client.emit(SOCKET_CHANELS.joinRoomResponse, 'connected!')

    console.log(`connected to ${user.id} - ${user.originalAccount.brandId} - ${user.originalAccount.companyId}`);
  }

    async handleDisconnect(client: Socket) {
    console.log('disconnected');
     // I can see this message in console
  }
}