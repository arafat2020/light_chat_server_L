import { Injectable, Res } from '@nestjs/common';
import { Response } from 'express'
import { join } from 'path';

@Injectable()
export class AppService {
  getHello( res: Response) {
    return res.sendFile('index.html',{root:join(__dirname, '..', 'client')});
  }
}