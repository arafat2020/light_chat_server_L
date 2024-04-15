import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { ConfigService } from "@nestjs/config/dist/config.service";
import Mail from 'nodemailer/lib/mailer';
import { HttpStatus } from '@nestjs/common/enums'
import { HttpException } from '@nestjs/common/exceptions'



@Injectable()
export class EmailService {
    constructor(private consfig: ConfigService) { }

    async initiate() {
        const transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.consfig.get('USER'),
                pass: this.consfig.get('PASS')
            }
        })
        return transporter
    }

    async sendMail({ to, subject, text }: Mail.Options):Promise<{}> {
        const mailer = await this.initiate()
        let data 
        await mailer.sendMail({ from: this.consfig.get('USER'), to, subject, text }, (err, info) => {
            if (err) {
                throw new HttpException({
                    msg: 'Something went wring',
                    obj: err
                }, HttpStatus.INTERNAL_SERVER_ERROR)
            } else {                
                data = info
            }
        })

        return {
            isSend:true,
            data
        }
    }
}
