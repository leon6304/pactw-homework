import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;
  async acquireLock(
    key: string,
    expiration: number,
    maxRetries: number,
    retryInterval: number,
  ): Promise<boolean> {
    let retries = 0;
    while (retries < maxRetries) {
      const result = await this.redisClient.set(key, 'locked', {
        NX: true,
        EX: expiration,
      });
      if (result === 'OK') {
        return true;
      } else {
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
        retries++;
      }
    }
    return false;
  }

  async releaseLock(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
