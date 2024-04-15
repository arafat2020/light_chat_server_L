import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MemberRole } from '@prisma/client';

export class Member_join {

    @ApiProperty({
        description: 'Invite code to join'
    })
    @IsNotEmpty()
    inviteCode: string

}

export class Member_update {

    @ApiProperty({
        description: 'Server ID of user joined in'
    })
    @IsNotEmpty()
    serverId: string

    @ApiProperty({
        description: 'ID of the member'
    })
    @IsNotEmpty()
    memberId: string

    @ApiProperty({
        description: 'Role of the member'
    })
    @IsNotEmpty()
    role: MemberRole

}

export class Member_kick {

    @ApiProperty({
        description: 'Server ID of the user to kick out'
    })
    @IsNotEmpty()
    serverId: string

    @ApiProperty({
        description: 'ID of the member to kick out'
    })
    @IsNotEmpty()
    memberId: string

}