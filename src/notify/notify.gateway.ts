import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@WebSocketGateway({ namespace: 'notify' })
export class NotifyGateway {
  constructor(private jwt:JwtService,private config:ConfigService){}

  @WebSocketServer()
  server: Server

  afterInit() {
    this.server.use(async (req, next) => {
      const {authorization} = req.handshake.headers
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

  @SubscribeMessage('notification')
  handleEvent(client: Socket, data: any) {
    console.log(`Event received from client ${client.id}:`, data);
    this.server.emit('notification', {
      user:client.handshake.headers.user,
      data
    });
  }

  sendNotification_forServer(members:string[],title:string,content:string,admin:string){
    members.map((e)=>{
      this.server.emit(e,{
        title,
        content,
        admin
      })
    })
  }

}
