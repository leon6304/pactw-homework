import { createClient } from 'redis';
import * as dotenv from 'dotenv';
dotenv.config();
let host: string = process.env.REDIS_HOST;
let port: number = Number(process.env.REDIS_PORT);
if (process.env.NODE_ENV === 'DEV') {
  host = process.env.DEV_REDIS_HOST;
  port = Number(process.env.DEV_REDIS_PORT);
}

export const RedisService = {
  provide: 'REDIS_CLIENT',
  async useFactory() {
    const client = createClient({
      socket: {
        host: host,
        port: port,
      },
    });
    await client.connect();
    client.set('treasure', 100);
    const value = await client.get('treasure');
    console.log(`treasure value : ${value}`);
    return client;
  },
};
