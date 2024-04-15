import { IsNotEmpty, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelType } from '@prisma/client';

export class ChannelDTO_create {
    @ApiProperty({
        description: 'Channel name',
        required: true
    })
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: 'Channel type',
        enum: ChannelType,
        default: ChannelType.TEXT
    })
    type: ChannelType

    @ApiProperty({
        description: 'Server Id that will be container of the Channel',
        required: true
    })
    @IsNotEmpty()
    serverId: string
}

export class ChannelDTO_update {

    @ApiProperty({
        description: 'Channel id',
        required: true
    })
    @IsNotEmpty()
    channelId: string

    @ApiProperty({
        description: 'Server Id that caontaining the Channel',
        required: true
    })
    @IsNotEmpty()
    serverId: string

    @ApiProperty({
        description: 'Channel name',
        required: true
    })
    name: string

    @ApiProperty({
        description: 'Channel type',
        required: true,
        enum: ChannelType,
        default: ChannelType.TEXT
    })
    type: ChannelType
}

export class ChannelDTO_delete {

    @ApiProperty({
        description: 'Channel id',
        required: true
    })
    @IsNotEmpty()
    channelId: string

    @ApiProperty({
        description: 'Server Id that caontaining the Channel',
        required: true
    })
    @IsNotEmpty()
    serverId: string
}
