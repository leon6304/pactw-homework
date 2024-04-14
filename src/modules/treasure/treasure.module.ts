import { Module } from '@nestjs/common';
import { TreasureController } from './treasure.controller';
import { TreasureService } from './treasure.service';

@Module({
  controllers: [TreasureController],
  providers: [TreasureService],
})
export class TreasureModule {}
