import {
    Controller,
    UseGuards,
    Get,
    Post,
    Delete,
    Patch,
    Body,
    Request
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MessageService } from './message.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ValidationPipe } from 'src/auth/validation.pipe';
import {
    MessageDTO_create,
    MessageDTO_delete,
    MessageDTO_get,
    MessageDTO_update
} from './message.dto';

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) { }

    @ApiBearerAuth()
    @Get('get')
    get(@Body(new ValidationPipe()) credential: MessageDTO_get, @Request() req) {
        return this.messageService.get({
            channelId: credential.channelId
        })
    }

    @ApiBearerAuth()
    @Post('create')
    create(@Body(new ValidationPipe()) credential: MessageDTO_create, @Request() req) {
        return this.messageService.create({
            channelId: credential.channelId,
            content: credential.content,
            fileUrl: credential.fileUrl,
            serverId: credential.serverId,
            user: req.user,
            uuid: credential.uuid
        })
    }

    @ApiBearerAuth()
    @Patch('update')
    update(@Body(new ValidationPipe()) credential: MessageDTO_update, @Request() req) {
        return this.messageService.update({
            channelId: credential.channelId,
            content: credential.content,
            messageId: credential.messageId,
            serverId: credential.serverId,
            user: req.user
        })
    }

    @ApiBearerAuth()
    @Delete('delete')
    delete(@Body(new ValidationPipe()) credential: MessageDTO_delete, @Request() req) {
        return this.messageService.delete({
            channelId: credential.channelId,
            messageId: credential.messageId,
            serverId: credential.serverId,
            user: req.user
        })
    }

}
