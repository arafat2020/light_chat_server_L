import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDTO_create {

    @ApiProperty({
        description: "Obj ID of server"
    })
    @IsNotEmpty()
    serverId: string

    @ApiProperty({
        description: "Obj ID of ChannelID"
    })
    @IsNotEmpty()
    channelId: string

    @ApiProperty({
        description: "Content of the message"
    })
    @IsNotEmpty()
    content: string

    @ApiProperty({
        description: "File ulr if you want to share",
        required:false
    })
    fileUrl: string | undefined

    @ApiProperty({
        description: "uuid of a massage"
    })
    @IsNotEmpty()
    uuid: string
}

export class MessageDTO_update {
    @ApiProperty({
        description: "Obj ID of server"
    })
    @IsNotEmpty()
    serverId: string

    @ApiProperty({
        description: "Obj ID of ChannelID"
    })
    @IsNotEmpty()
    channelId: string

    @ApiProperty({
        description: "Obj ID of message"
    })
    @IsNotEmpty()
    messageId: string

    @ApiProperty({
        description: "Content for message update"
    })
    @IsNotEmpty()
    content: string

}

export class MessageDTO_delete {

    @ApiProperty({
        description: "Obj ID of Server"
    })
    @IsNotEmpty()
    serverId: string

    @ApiProperty({
        description: "Obj ID of ChannelID"
    })
    @IsNotEmpty()
    channelId: string

    @ApiProperty({
        description: "Obj ID of message"
    })
    @IsNotEmpty()
    messageId: string

}

export class MessageDTO_get {

    @ApiProperty({
        description: "Obj ID of channel to get conversetion"
    })
    @IsNotEmpty()
    channelId:string
}

