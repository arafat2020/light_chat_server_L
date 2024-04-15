import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Profile, MemberRole } from '@prisma/client';
import { DbService } from 'src/db/db.service';

@Injectable()
export class MemberService {
    constructor(private prisma: DbService) {
        this.prisma.init()
     }

    async join({ inviteCode, user }: { inviteCode: string, user: Profile }) {
         
        try {
            const existingServer = await this.prisma.server.findFirst({
                where: {
                    inviteCode: inviteCode,
                    members: {
                        some: {
                            profileId: user.id
                        }
                    }
                }
            });
            if (existingServer) throw new HttpException('User is already a member', HttpStatus.BAD_REQUEST)
            const server = await this.prisma.server.update({
                where: {
                    inviteCode: inviteCode,
                },
                data: {
                    members: {
                        create: [
                            {
                                id: `${this.prisma.getObjId()}`,
                                profileId: user.id,
                            }
                        ]
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

    async update({ serverId, user, memberId, role }: { serverId: string, user: Profile, memberId: string, role: MemberRole }) {
         
        try {
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    profileId: user.id,
                },
                data: {
                    members: {
                        update: {
                            where: {
                                id: memberId,
                                profileId: {
                                    not: user.id
                                }
                            },
                            data: {
                                role
                            }
                        }
                    }
                },
                include: {
                    members: {
                        include: {
                            profile: true,
                        },
                        orderBy: {
                            role: "asc"
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

    async kickout({ serverId, user, memberId }: { serverId: string, user: Profile, memberId: string }) {
         
        try {
            const server = await this.prisma.server.update({
                where: {
                    id: serverId,
                    profileId: user.id,
                },
                data: {
                    members: {
                        deleteMany: {
                            id: memberId,
                            profileId: {
                                not: user.id
                            }
                        }
                    }
                },
                include: {
                    members: {
                        include: {
                            profile: true,
                        },
                        orderBy: {
                            role: "asc",
                        }
                    },
                },
            });
            return server
        } catch (error) {
            throw new HttpException({
                msg: 'Something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST,)
        }
    }
}
