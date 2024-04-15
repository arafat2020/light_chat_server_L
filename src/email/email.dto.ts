import { IsEmail, IsNotEmpty, } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDTO {

    @ApiProperty({
        description:'Email of the Recipient',
        required:true
    })
    @IsNotEmpty({
        message:'Recipient Email is required'
    })
    to:string

    @ApiProperty({
        description:'Subject of the Email',
        required:true
    })
    @IsNotEmpty({
        message:'Subject of Email is required'
    })
    subject:string

    @ApiProperty({
        description:'Body of the Email',
        required:true
    })
    @IsNotEmpty({
        message:'Body of Email is required'
    })
    text:string
}