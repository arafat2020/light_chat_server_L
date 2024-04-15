import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Profile } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { DbService } from 'src/db/db.service';


@Injectable()
export class ConversationMiddleware implements NestMiddleware {
  constructor(
    private prisma: DbService,
    private jwt:JwtService,
    private config:ConfigService
    ) { }
  async use(req: Request, res: Response, next: NextFunction) {
    const { conversationId, directMessageId }: { conversationId: string, directMessageId: string } = req.body
    if (!conversationId || !directMessageId) return res.status(400).json({ msg: 'Bad requist' })
    const token = await (() => {
      const [type, token] = req.headers.authorization?.split(' ') ?? [];
      return type === 'Bearer' ? token : undefined;
    })()
    if (!token) return res.status(400).json({ msg: 'Bad requist' })
    const profile = await this.jwt.verifyAsync(token,{
      secret: this.config.get("JWT_SECRET")
    })
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            }
          },
          {
            memberTwo: {
              profileId: profile.id,
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

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    let directMessage = await this.prisma.directMessage.findFirst({
      where: {
        id: directMessageId,
        conversationId: conversationId,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    next();
  }
}
