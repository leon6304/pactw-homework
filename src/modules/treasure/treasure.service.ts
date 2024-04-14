import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import * as dotenv from 'dotenv';
import { RedisService } from '../redis/redis.service';

dotenv.config();
@Injectable()
export class TreasureService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  constructor(private readonly redisService: RedisService) {}

  async getValues(): Promise<{ treasure: string }> {
    const treasureValue = await this.redisClient.get('treasure');
    return { treasure: treasureValue };
  }

  async addOne(): Promise<{ treasure: string }> {
    const lockKey = 'myLock';
    const lockExpiration = 10;
    const maxRetries = 5;
    const retryInterval = 5;
    const lockAcquired = await this.redisService.acquireLock(
      lockKey,
      lockExpiration,
      maxRetries,
      retryInterval,
    );

    if (lockAcquired) {
      try {
        const updateTime: null | string =
          await this.redisClient.get('updateTime');
        if (
          updateTime !== null &&
          Number(updateTime) >= Number(process.env.UPDATE_LOCK_TIME)
        ) {
          throw new HttpException('短時間內超過修改上限', HttpStatus.FORBIDDEN);
        }
        await this.redisClient.incr('treasure');
        if (updateTime === null) {
          await this.redisClient.setEx(
            'updateTime',
            Number(process.env.UPDATE_LOCK_EXPIRATION),
            '0',
          );
        }
        await this.redisClient.incr('updateTime');
        const outputValue = await this.redisClient.get('treasure');
        return { treasure: outputValue };
      } finally {
        await this.redisService.releaseLock(lockKey);
      }
    } else {
      throw new HttpException('伺服器忙碌中', HttpStatus.FORBIDDEN);
    }
  }
}
