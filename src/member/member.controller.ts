import { Controller, Post, Patch, UseGuards, Body, ValidationPipe, Request } from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Member_join, Member_kick, Member_update } from './member.dto';

@UseGuards(AuthGuard)
@Controller('member')
export class MemberController {
    constructor(private memberService: MemberService) { }

    @Post('join')
    @ApiBearerAuth()
    join(@Body(new ValidationPipe) member: Member_join, @Request() req) {
        return this.memberService.join({
            inviteCode: member.inviteCode,
            user: req.user
        })
    }

    @Patch('update')
    @ApiBearerAuth()
    update(@Body(new ValidationPipe) member: Member_update, @Request() req) {
        return this.memberService.update({
            memberId: member.memberId,
            serverId: member.serverId,
            role: member.role,
            user: req.user
        })
    }

    @Post('kick')
    @ApiBearerAuth()
    kick(@Body(new ValidationPipe) member: Member_kick, @Request() req) {
        return this.memberService.kickout({
            memberId: member.memberId,
            serverId: member.serverId,
            user: req.user
        })
    }

}
