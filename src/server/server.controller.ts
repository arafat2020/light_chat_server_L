import { Controller, UseGuards, Post, Body, Request, Patch, Get, Delete,Query } from '@nestjs/common';
import { ServerService } from './server.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ValidationPipe } from 'src/auth/validation.pipe';
import { ServerDTO_create, ServerDTO_delete_and_get, ServerDTO_update } from './server.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('server')
export class ServerController {
    constructor(private serverService: ServerService) { }

    @Post('create')
    @ApiBearerAuth()
    create(@Body(new ValidationPipe) server: ServerDTO_create, @Request() req) {
        return this.serverService.createServer({
            serverImg: server.imageUrl,
            serverName: server.name,
            user: req.user
        })
    }

    @Patch('update')
    @ApiBearerAuth()
    update(@Body(new ValidationPipe) server: ServerDTO_update, @Request() req) {
        return this.serverService.updateServer({
            serverId: server.serverId,
            name: server.name,
            imageUrl: server.imageUrl,
            user: req.user
        })
    }

    @Get('get')
    @ApiBearerAuth()
    get(@Query(new ValidationPipe) server: ServerDTO_delete_and_get, @Request() req) {
        return this.serverService.getServer({
            serverId: server.serverId,
            user: req.user
        })
    }

    @Get('get/all')
    @ApiBearerAuth()
    getAll(@Request() req) {
        return this.serverService.getInvovesServers(req.user)
    }

    @Delete('delete')
    @ApiBearerAuth()
    delete(@Body(new ValidationPipe) server: ServerDTO_delete_and_get, @Request() req) {
        return this.serverService.deleteServer({
            serverId: server.serverId,
            user: req.user
        })
    }

    @Patch('leave')
    @ApiBearerAuth()
    leave(@Body(new ValidationPipe) server: ServerDTO_delete_and_get, @Request() req) {
        return this.serverService.leaveServer({
            serverId: server.serverId,
            user: req.user
        })
    }

}
