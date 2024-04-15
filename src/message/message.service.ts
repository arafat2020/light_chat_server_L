import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { Member, MemberRole, Message, Profile } from '@prisma/client';
import { MessageGateway } from './message.gateway';

@Injectable()
export class MessageService {
    constructor(
        private prisma: DbService,
        private getWay: MessageGateway
    ) {
        this.prisma.init()
    }

    async isServerExistandMemverExist({ serverId, user }: { serverId: string, user: Profile }) {
        const server = await this.prisma.server.findFirst({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: user.id,
                    }
                }
            },
            include: {
                members: true,
            }
        })

        if (!server) throw new HttpException({
            msg: 'server not found'
        }, HttpStatus.BAD_REQUEST)

        const member = server.members.find((member) => member.profileId === user.id);

        if (!member) throw new HttpException({
            msg: 'member not found'
        }, HttpStatus.BAD_REQUEST)

        return member
    }

    async isChaannelExist({ channelId, serverId }: { channelId: string, serverId: string }) {
        const channel = await this.prisma.channel.findFirst({
            where: {
                id: channelId,
                serverId: serverId,
            },
        });

        if (!channel) throw new HttpException({
            msg: 'Channel not found'
        }, HttpStatus.BAD_REQUEST)
    }

    roleIdentifire({ member, message }: { message: Message, member: Member }) {
        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;
        return {
            isMessageOwner,
            isAdmin,
            isModerator,
            canModify
        }
    }

    async get({ channelId }: { channelId: string }) {
        try {
            const messages = await this.prisma.message.findMany({
                take: 10,
                where: {
                    channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            });
            return messages
        } catch (error) {
            throw new HttpException({
                msg: 'something went wrong'
            }, HttpStatus.BAD_REQUEST)
        }
    }

    async create({
        serverId,
        user,
        channelId,
        content,
        fileUrl,
        uuid 
    }: {
            serverId: string,
            user: Profile,
            channelId: string,
            content: string,
            fileUrl: string | undefined,
            uuid:string
        }) {
        try {
            const member = await this.isServerExistandMemverExist({
                serverId,
                user
            })
            await this.isChaannelExist({
                channelId,
                serverId
            })
            const message = await this.prisma.message.create({
                data: {
                    id: `${this.prisma.getObjId()}`,
                    content,
                    fileUrl,
                    channelId: channelId as string,
                    memberId: member.id,
                    u_id:uuid
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            });
            this.getWay.broadCastMessage({
                channelId: message.channelId,
                payload: message,
                type: 'create'
            })
            return message
        } catch (error) {
            throw new HttpException({
                msg: 'something went wrong'
            }, HttpStatus.BAD_REQUEST)
        }
    }

    async update({ channelId, messageId, serverId, user, content }: { messageId: string, channelId: string, serverId: string, user: Profile, content: string }) {
        await this.isChaannelExist({
            channelId,
            serverId
        })
        const member = await this.isServerExistandMemverExist({
            serverId,
            user
        })
        try {
            let message = await this.prisma.message.findFirst({
                where: {
                    id: messageId,
                    channelId: channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })

            if (!message || message.deleted) throw new HttpException({
                msg: 'message not found'
            }, HttpStatus.BAD_REQUEST)
            const { isMessageOwner } = this.roleIdentifire({
                member,
                message
            })
            if (!isMessageOwner) throw new HttpException({
                msg: 'Unauthorize'
            }, HttpStatus.UNAUTHORIZED)
            message = await this.prisma.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    content,
                    updatedAt: new Date().toISOString()
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
            this.getWay.broadCastMessage({
                channelId: message.channelId,
                payload: message,
                type: 'update'
            })
            return message
        } catch (error) {
            throw new HttpException({
                msg: 'something went wrong'
            }, HttpStatus.BAD_REQUEST)
        }
    }

    async delete({ channelId, serverId, user, messageId }: { channelId: string, serverId: string, user: Profile, messageId: string }) {
        try {
            await this.isChaannelExist({
                channelId,
                serverId
            })
            const member = await this.isServerExistandMemverExist({
                serverId,
                user
            })
            let message = await this.prisma.message.findFirst({
                where: {
                    id: messageId,
                    channelId: channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })

            if (!message || message.deleted) throw new HttpException({
                msg: 'message not found'
            }, HttpStatus.BAD_REQUEST)
            const { canModify } = this.roleIdentifire({
                member,
                message
            })
            if (!canModify) throw new HttpException({
                msg: 'Unauthorize'
            }, HttpStatus.BAD_REQUEST)
            message = await this.prisma.message.update({
                where: {
                    id: messageId,
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted.",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
            this.getWay.broadCastMessage({
                channelId: message.channelId,
                payload: message,
                type: 'delete'
            })
            return message
        } catch (error) {
            throw new HttpException({
                msg: 'something went wrong'
            }, HttpStatus.BAD_REQUEST)
        }
    }

}
