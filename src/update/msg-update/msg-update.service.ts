import { Injectable, Logger } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MsgUpdateService {
    constructor(private prisma: DbService) {
        this.prisma.init()
    }
    async uuidUdate() {
        const msg = await this.prisma.message.findMany({

        })
        msg.map(async e => {
            if (e.u_id === null) {
                const updatedMsg = await this.prisma.message.update({
                    where: {
                        id: e.id
                    },
                    data: {
                        u_id: uuid()
                    }
                })
                console.log(updatedMsg);
                
            }
        })

    }
}
