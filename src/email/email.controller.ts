import { Controller,Post,Body } from '@nestjs/common';
import { EmailService } from './email.service';
import { ValidationPipe } from 'src/auth/validation.pipe';
import { EmailDTO } from './email.dto';

@Controller('email')
export class EmailController {
    constructor(private emailService:EmailService){}

    @Post('send')
    sendMail(@Body(new ValidationPipe) mailoption:EmailDTO){
        return this.emailService.sendMail(mailoption)
    }
}
