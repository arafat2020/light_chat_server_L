import { Module } from '@nestjs/common';
import { ConversetionUpdateService } from './conversetion-update.service';

@Module({
  providers: [ConversetionUpdateService],
  exports:[ConversetionUpdateService]
})
export class ConversetionUpdateModule {}
