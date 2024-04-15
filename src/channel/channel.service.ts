import { Injectable } from '@nestjs/common';
import { MemberRole, Profile, ChannelType } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class ChannelService {
    constructor(private prisma: DbService) {
        this.prisma.init()
    }

    // -----------------------------------channel create start----------------------------------------
    async channelCreate({ serverId, user, name, type = ChannelType.TEXT }: { serverId: string, user: Profile, name: string, type: ChannelType }) {

        if (name == "general") throw new HttpException('Chennal General is already exist', HttpStatus.BAD_REQUEST)
        try {
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            profileId: user.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                            }
                        }
                    }
                },
                data: {
                    channels: {
                        create: {
                            id: `${this.prisma.getObjId()}`,
                            profileId: user.id,
                            name,
                            type,
                        }
                    }
                },
                include: {
                    channels: true
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
    // -----------------------------------channel create end----------------------------------------
    // -----------------------------------channel update start----------------------------------------
    async channelUpdate({ serverId, user, name, type, channelId }: { serverId: string, user: Profile, name: string | undefined, type: ChannelType | undefined, channelId: string }) {

        if (name === "general") throw new HttpException('Chennal General cannot be u[dated', HttpStatus.BAD_REQUEST)
        try {
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            profileId: user.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                            }
                        }
                    }
                },
                data: {
                    channels: {
                        update: {
                            where: {
                                id: channelId,
                                NOT: {
                                    name: "general",
                                },
                            },
                            data: {
                                name,
                                type,
                            }
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
    // -----------------------------------chennal update end----------------------------------------
    // -----------------------------------chennal delete start----------------------------------------
    async chennelDelete({ serverId, user, channelId }: { serverId: string, user: Profile, channelId: string }) {

        try {
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    members: {
                        some: {
                            profileId: user.id,
                            role: {
                                in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                            }
                        }
                    }
                },
                data: {
                    channels: {
                        delete: {
                            id: channelId,
                            name: {
                                not: "general",
                            }
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
    // -----------------------------------chennal delete end----------------------------------------
    // -----------------------------------Get chennals start----------------------------------------
    async getCannels({ serverId }: { serverId: string }) {

        try {
            const server = await this.prisma.server.findUnique({
                where: {
                    id: serverId,
                },
                include: {
                    channels: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                    members: {
                        include: {
                            profile: true,
                        },
                        orderBy: {
                            role: "asc",
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
    // -----------------------------------Get chennals end----------------------------------------

}
