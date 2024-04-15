import {
    Controller,
    UseGuards,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    Request
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ValidationPipe } from 'src/auth/validation.pipe';
import {
    ConversationDTO_delete,
    ConversationDTO_update,
    ConversationMessageDTO,
    GetOrCreateConversationDTO
} from './conversation.dto';

@UseGuards(AuthGuard)
@Controller('conversation')
export class ConversationController {
    constructor(private conversetionService: ConversationService) { }

    @Post('get')
    @ApiBearerAuth()
    get(@Body(new ValidationPipe) credential: GetOrCreateConversationDTO) {
        return this.conversetionService.getOrCreateConversation({
            memberOneId: credential.memberOneId,
            memberTwoId: credential.memberTwoId
        })
    }

    @Post('create')
    @ApiBearerAuth()
    create(@Body(new ValidationPipe) credential: ConversationMessageDTO, @Request() req) {
        return this.conversetionService.create({
            content: credential.content,
            conversationId: credential.conversationId,
            fileUrl: credential.fileUrl,
            user:req.user
        })
    }

    @Patch('update')
    @ApiBearerAuth()
    update(@Body(new ValidationPipe) credential: ConversationDTO_update) {
        return this.conversetionService.update({
            content:credential.content,
            directMessageId:credential.directMessageId
        })
    }

    @Delete('delete')
    @ApiBearerAuth()
    delete(@Body(new ValidationPipe) credential: ConversationDTO_delete) {
        return this.conversetionService.delete({
            directMessageId:credential.directMessageId
        })
    }

}
