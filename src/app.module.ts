import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisConfig } from './modules/redis/redis.config';
import { RedisService } from './modules/redis/redis.service';
import { TreasureService } from './modules/treasure/treasure.service';
import { TreasureController } from './modules/treasure/treasure.controller';

@Module({
  imports: [],
  controllers: [AppController, TreasureController],
  providers: [AppService, RedisConfig, TreasureService, RedisService],
})
export class AppModule {}
