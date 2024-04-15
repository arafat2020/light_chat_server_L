import { Controller,Get } from '@nestjs/common';
import { MsgUpdateService } from './msg-update.service';

@Controller('msg-update')
export class MsgUpdateController {
    constructor(private msg:MsgUpdateService){
    }

    // @Get("update")
    // get(){
    //     return this.msg.uuidUdate()
    // }
}
