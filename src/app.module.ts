import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './modules/redis/redis/redis.service';
import { TreasureService } from './modules/treasure/treasure/treasure.service';
import { TreasureController } from './modules/treasure/treasure/treasure.controller';

@Module({
  imports: [],
  controllers: [AppController, TreasureController],
  providers: [AppService, RedisService, TreasureService],
})
export class AppModule {}
