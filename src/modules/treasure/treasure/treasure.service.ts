import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class TreasureService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  async getValues(): Promise<{ treasure: string }> {
    const treasureValue = await this.redisClient.get('treasure');
    return { treasure: treasureValue };
  }
  async addOne(): Promise<{ treasure: string }> {
    let treasureValue = Number(await this.redisClient.get('treasure'));
    treasureValue += 1;
    await this.redisClient.set('treasure', treasureValue);
    const outputValue = await this.redisClient.get('treasure');
    return { treasure: outputValue };
  }
}
