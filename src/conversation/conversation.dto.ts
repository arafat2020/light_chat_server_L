import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetOrCreateConversationDTO {

    @ApiProperty({
        description: 'Id of the first member who want a one o one conversetion'
    })
    @IsNotEmpty()
    memberOneId: string

    @ApiProperty({
        description: 'Id of the second person with whomw the first will make conversetion'
    })
    @IsNotEmpty()
    memberTwoId: string
}

export class ConversationMessageDTO {

    @ApiProperty({
        description:'Created Conversetion Obj ID'
    })
    @IsNotEmpty()
    conversationId: string

    @ApiProperty({
        description:"Content of the message"
    })
    @IsNotEmpty()
    content: string

    @ApiProperty({
        description:'Link of a file that you want to share'
    })
    fileUrl: string | undefined
}

export class ConversationDTO_update {
    @ApiProperty({
        description:'New Contente for update'
    })
    @IsNotEmpty()
    content: string

    @ApiProperty({
        description:"Obj ID of the direct message"
    })
    @IsNotEmpty()
    directMessageId: string

    @ApiProperty({
        description:"Obj ID of the conversation"
    })
    @IsNotEmpty()
    conversationId:string
}

export class ConversationDTO_delete {

    @ApiProperty({
        description:"Obj ID of the direct meddage"
    })
    @IsNotEmpty()
    directMessageId: string
}