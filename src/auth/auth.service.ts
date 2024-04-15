import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { LibService } from 'src/lib/lib.service';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {
    constructor(
        private prisma: DbService,
        private lib: LibService,
        private jwt: JwtService,
        private config:ConfigService
    ) {
        this.prisma.init()
     }

    async signUp(name: string, password: string, email: string, imgUrl: string, userId: string,) {
        const img = await this.lib.cldUpload(imgUrl)
        const hasedPassword = await this.lib.getHashed(password)
        try {
            const newUser = await this.prisma.profile.create({
                data: {
                    id: `${this.prisma.getObjId()}`,
                    passward: hasedPassword,
                    email: email,
                    imageUrl: img.url,
                    name: name,
                    userId: userId
                }
            })
            return {
                newUser,
                access_token: await this.jwt.signAsync(newUser,{
                    secret: this.config.get("JWT_SECRET"),
                    expiresIn:'7d'
                })
            }
        } catch (error) {
            await this.lib.deleteImage(img.public_id)
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.INTERNAL_SERVER_ERROR,)
        }
    }

    async signIn(email: string, password: string) {
        try {
            const user = await this.prisma.profile.findUnique({
                where: {
                    email: email
                },
            })
            if (user == null) return new HttpException('User Not Found', HttpStatus.NOT_FOUND);
            const isVarified = await this.lib.VerifyPassword(user.passward, password)
            if (!isVarified) return new HttpException('Incorrect Password', HttpStatus.BAD_REQUEST);
            const userObj = Object.assign({}, user)
            await delete userObj.passward
            return {
                userObj,
                access_token: await this.jwt.signAsync(userObj,{
                    secret: this.config.get("JWT_SECRET"),
                    expiresIn:'7d'
                })
            }
        } catch (error) {
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.INTERNAL_SERVER_ERROR,)
        }
    }


}
