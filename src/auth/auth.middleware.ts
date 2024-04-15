import { Injectable, NestMiddleware,HttpStatus } from '@nestjs/common';
import { ProvidorType } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    function isValueInEnum(value: any): value is ProvidorType {
      return Object.values(ProvidorType).includes(value);
    }
    if (isValueInEnum(req.body.providor)) return next();
    res.status(HttpStatus.BAD_REQUEST).send('Providor is note valide')
  }
}