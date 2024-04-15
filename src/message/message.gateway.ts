import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server } from 'socket.io';


@WebSocketGateway({namespace:'message'})
export class MessageGateway {
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

  broadCastMessage<T>({channelId,payload,type}:{channelId:string, payload:T, type:'create'|'update'|'delete'}){
    this.server.emit(channelId,{
      payload,
      type
    })
  }
}
