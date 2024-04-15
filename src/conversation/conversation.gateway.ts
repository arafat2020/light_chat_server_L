import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {  WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: 'conversation' })
export class ConversationGateway {
  constructor(private jwt: JwtService, private config: ConfigService) { }

  @WebSocketServer()
  server: Server

  afterInit() {
    this.server.use(async (req, next) => {
      const { authorization } = req.handshake.headers
      try {
        const [Bearer, token] = authorization.split(" ")
        const payload = await this.jwt.verifyAsync(token, {
          secret: this.config.get('JWT_SECRET')
        })
        req.handshake.headers["user"] = payload
        next()
      } catch (error) {
        next(error)
      }

    })
  }

  boradcastConversation<T>({ conversationId, pyaload, type }: { conversationId: string, pyaload: T ,type:'create'|'update'|'delete'}) {
    this.server.emit(conversationId,{
      pyaload,
      type
    })
  }


}
