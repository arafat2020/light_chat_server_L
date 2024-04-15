import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ServerDTO_create {

    @ApiProperty({
        description: 'Name of Server that will be newly created',
        required: true
    })
    @IsNotEmpty()
    name: string

    @ApiProperty({
        description: 'Server Image that will represent the server',
        required: true
    })
    @IsNotEmpty()
    imageUrl: string

}

export class ServerDTO_update {

    @ApiProperty({
        description: 'Rename server',
        required: false
    })
    name: string

    @ApiProperty({
        description: 'Re-upload image',
        required: false
    })
    imageUrl: string

    @ApiProperty({
        description: 'Id of the server',
        required: true
    })
    @IsNotEmpty()
    serverId: string

}

export class ServerDTO_delete_and_get {
    @ApiProperty({
        description: 'Id of the server',
        required: true
    })
    @IsNotEmpty()
    serverId: string
}
