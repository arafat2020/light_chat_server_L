import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { MemberRole, Profile, Server } from "prisma/prisma-client";
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { LibService } from 'src/lib/lib.service';

@Injectable()
export class ServerService {
    constructor(
        private prisma: DbService,
        private lib: LibService
    ) {
        this.prisma.init()
     }

    generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // -----------------------------------server create start----------------------------------------
    async createServer({ serverName, serverImg, user }: { serverName: string, serverImg: string, user: Profile }): Promise<Server> {
         
        const img = await this.lib.cldUpload(serverImg)
        try {
            const server = await this.prisma.server.create({
                data: {
                    id: `${this.prisma.getObjId()}`,
                    name: serverName,
                    imageUrl: img.url,
                    profileId: user.id,
                    inviteCode: await this.generateRandomString(10),
                    channels: {
                        create: [
                            {
                                id: `${this.prisma.getObjId()}`,
                                name: 'general',
                                profileId: user.id
                            }
                        ]
                    },
                    members: {
                        create: [
                            {
                                id: `${this.prisma.getObjId()}`,
                                profileId: user.id,
                                role: MemberRole.ADMIN
                            }
                        ]
                    }
                }
            })
            return server
        } catch (error) {
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST,)
        }
    }
    // -----------------------------------server create end----------------------------------------
    // -----------------------------------server delete start----------------------------------------

    async deleteServer({ serverId, user }: { serverId: string, user: Profile }) {
         
        try {
            const server = await this.prisma.server.delete({
                where: {
                    id: serverId,
                    profileId: user.id,
                }
            });
            return server
        } catch (error) {
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST,)
        }
    }
    // -----------------------------------server create end----------------------------------------
    // -----------------------------------server upadte start----------------------------------------
    async updateServer({ serverId, user, name, imageUrl }: { name: string | undefined, imageUrl: string | undefined, serverId: string, user: Profile }) {
         
        const img = imageUrl ? await this.lib.cldUpload(imageUrl) : null
        try {
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    profileId: user.id,
                },
                data: {
                    name,
                    imageUrl: img.url,
                }
            });
            return server

        } catch (error) {
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST,)
        }
    }
    // -----------------------------------server upadte end----------------------------------------
    // ----------------------------------- get servers start----------------------------------------
    async getServer({ serverId, user }: { serverId: string, user: Profile }) {
         
        try {
            const server = await this.prisma.server.findUnique({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            profileId: user.id,
                        }
                    }
                },
                include: {
                    channels: {
                        where: {
                            name: "general"
                        },
                        orderBy: {
                            createdAt: "asc"
                        }
                    }
                }
            })
            return server
        } catch (error) {
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST,)
        }
    }
    // ----------------------------------- get servers end----------------------------------------
    // ----------------------------------- leave from server start----------------------------------------
    async leaveServer({ serverId, user }: { serverId: string, user: Profile }) {
         
        try {
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    profileId: {
                        not: user.id
                    },
                    members: {
                        some: {
                            profileId: user.id
                        }
                    }
                },
                data: {
                    members: {
                        deleteMany: {
                            profileId: user.id
                        }
                    }
                }
            });
            return server
        } catch (error) {
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST,)
        }
    }
    // ----------------------------------- leave from server end----------------------------------------
    // ----------------------------------- Get all u=involved server start----------------------------------------
    async getInvovesServers(user: Profile) {
         
        try {
            const servers = await this.prisma.server.findMany({
                where: {
                    members: {
                        some: {
                            profileId: user.id
                        }
                    }
                }
            })
            return servers
        } catch (error) {
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST,)
        }

    }
    // ----------------------------------- Get all u=involved server end----------------------------------------

}
