import { Controller, Get } from '@nestjs/common';
import { ConversetionUpdateService } from './conversetion-update/conversetion-update.service';

@Controller('update')
export class UpdateController {
    constructor(private conversetionService:ConversetionUpdateService){}

    @Get('conversetion-uuid')
    get(){
        return this.conversetionService.update()
    }
}
