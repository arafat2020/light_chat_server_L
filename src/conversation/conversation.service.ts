import { Injectable, Logger } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { DbService } from 'src/db/db.service';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { ConversationGateway } from './conversation.gateway';

@Injectable()
export class ConversationService {
    constructor(
        private prisma: DbService,
        private getWay: ConversationGateway
    ) {
        this.prisma.init()
    }

    // -----------------------------------One to one chat create start----------------------------------------
    async getOrCreateConversation({ memberOneId, memberTwoId }: { memberOneId: string, memberTwoId: string }) {
        const findConversation = async (memberOneId: string, memberTwoId: string) => {
            try {
                return await this.prisma.conversation.findFirst({
                    where: {
                        AND: [
                            { memberOneId: memberOneId },
                            { memberTwoId: memberTwoId },
                        ]
                    },
                    include: {
                        memberOne: {
                            include: {
                                profile: true,
                            }
                        },
                        memberTwo: {
                            include: {
                                profile: true,
                            }
                        }
                    }
                });
            } catch (error) {
                throw new HttpException({
                    msg: 'something went wrong (find)',
                    obj: error
                }, HttpStatus.BAD_REQUEST)
            }
        }

        const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
            console.log(memberOneId, memberTwoId);
            try {
                return await this.prisma.conversation.create({
                    data: {
                        id: `${this.prisma.getObjId()}`,
                        memberTwoId,
                        memberOneId,
                    },
                    include: {
                        memberOne: {
                            include: {
                                profile: true,
                            }
                        },
                        memberTwo: {
                            include: {
                                profile: true,
                            }
                        }
                    }
                })
            } catch (error) {
                console.log(error);
                throw new HttpException({
                    msg: 'something went wrong (create)',
                    obj: error
                }, HttpStatus.BAD_REQUEST)
            }
        }
        const conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

        if (!conversation) return await createNewConversation(memberOneId, memberTwoId);

        console.log(conversation)

        return conversation;
    }
    // -----------------------------------One to one chat end----------------------------------------
    // -----------------------------------One to one massage create start----------------------------------------
    async create({ conversationId, user, content, fileUrl }: { conversationId: string, user: Profile, content: string, fileUrl: string | undefined }) {
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                OR: [
                    {
                        memberOne: {
                            profileId: user.id,
                        }
                    },
                    {
                        memberTwo: {
                            profileId: user.id,
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                }
            }
        })
        if (!conversation) throw new HttpException('conversation not found', HttpStatus.NOT_FOUND)
        const member = conversation.memberOne.profileId === user.id ? conversation.memberOne : conversation.memberTwo

        if (!member) throw new HttpException('member not found', HttpStatus.NOT_FOUND)

        try {
            const message = await this.prisma.directMessage.create({
                data: {
                    id: `${this.prisma.getObjId()}`,
                    content,
                    fileUrl,
                    conversationId: conversationId,
                    memberId: member.id,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            });
            this.getWay.boradcastConversation({
                conversationId: message.conversationId,
                pyaload: message,
                type:'create'
            })
            return message
        } catch (error) {
            throw new HttpException({
                msg: 'something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST)
        }
    }
    // -----------------------------------One to one massage create end----------------------------------------
    // -----------------------------------One to one massage update start----------------------------------------
    async update({ directMessageId, content }: { directMessageId: string, content: string }) {
        try {
            const directMessage = await this.prisma.directMessage.update({
                where: {
                    id: directMessageId,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
            this.getWay.boradcastConversation({
                conversationId: directMessage.conversationId,
                pyaload: directMessage,
                type:'update'
            })
            return directMessage
        } catch (error) {
            throw new HttpException({
                msg: 'something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST)
        }
    }
    // -----------------------------------One to one massage update end----------------------------------------
    // -----------------------------------One to one massage delete start----------------------------------------
    async delete({ directMessageId }: { directMessageId: string }) {
        try {
            const directMessage = await this.prisma.directMessage.update({
                where: {
                    id: directMessageId,
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
            this.getWay.boradcastConversation({
                conversationId: directMessage.conversationId,
                pyaload: directMessage,
                type:'delete'
            })
            return directMessage
        } catch (error) {
            throw new HttpException({
                msg: 'something went wrong',
                obj: error
            }, HttpStatus.BAD_REQUEST)
        }
    }
    // -----------------------------------One to one massage delete end----------------------------------------
}
