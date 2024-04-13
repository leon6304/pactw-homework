import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class TreasureService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  async getValues(): Promise<{ treasure: string }> {
    const treasureValue = await this.redisClient.get('treasure');
    return { treasure: treasureValue };
  }
  async addOne(): Promise<{ treasure: string }> {
    const updateTime: null | string = await this.redisClient.get('updateTime');
    if (
      updateTime !== null &&
      Number(updateTime) >= Number(process.env.UPDATE_LOCK_TIME)
    ) {
      throw new HttpException('短時間內超過修改上限', HttpStatus.FORBIDDEN);
    }
    await this.redisClient.incr('treasure');
    if (updateTime === null) {
      await this.redisClient.setEx('updateTime', 10, '0');
    }
    await this.redisClient.incr('updateTime');
    const outputValue = await this.redisClient.get('treasure');
    return { treasure: outputValue };
  }
}
