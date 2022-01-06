import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

enum EVENTS {
  SEND = 'message:send',
  MESSAGE_NEW = 'message:new',
  ALL = 'message:incoming',
}
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection<Socket>, OnGatewayDisconnect {
  private log: Logger = new Logger('MessageGateway')

  @WebSocketServer()
  readonly server: Server;

  private clients: Map<string, Socket> = new Map<string, any>()

  handleConnection(client: Socket, ...args: any[]): any {
    const { userId } = client.handshake.query
    this.clients.set(userId, client)
    this.log.log(`client with userId: ${userId} has been connected`)
  }

  handleDisconnect(client: Socket): any {
    const { userId } = client.handshake.query
    this.clients.delete(userId)
    this.log.log(`client with userId: ${userId} has been disconnected`)
  }

  notifyClients(userId: string) {
    const client = this.clients.get(userId)
    if (!client) {
      return false
    }

    this.server.emit(`${userId}-channel:message`, { sample: 'ade', other: 'b' })
    this.log.log(`clients notified`)
    return true
  }
}
