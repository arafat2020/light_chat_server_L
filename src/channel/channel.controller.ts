import { Controller, UseGuards, Post, Patch, Delete, Body, ValidationPipe, Request } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ChannelService } from './channel.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChannelDTO_create, ChannelDTO_delete, ChannelDTO_update } from './channel.dto';

@UseGuards(AuthGuard)
@Controller('channel')
export class ChannelController {
    constructor(private channelService: ChannelService) { }

    @Post('/create')
    @ApiBearerAuth()
    create(@Body(new ValidationPipe()) channel: ChannelDTO_create, @Request() req) {
        return this.channelService.channelCreate({
            serverId: channel.serverId,
            name: channel.name,
            type: channel.type,
            user: req.user
        })
    }

    @Patch('/update')
    @ApiBearerAuth()
    update(@Body(new ValidationPipe()) channel: ChannelDTO_update, @Request() req) {
        return this.channelService.channelUpdate({
            channelId: channel.channelId,
            name: channel.name,
            serverId: channel.serverId,
            type: channel.type,
            user: req.user
        })
    }

    @Delete('/delete')
    @ApiBearerAuth()
    delete(@Body(new ValidationPipe()) channel: ChannelDTO_delete, @Request() req) {
        return this.channelService.chennelDelete({
            channelId: channel.channelId,
            serverId: channel.serverId,
            user: req.user
        })
    }
}
