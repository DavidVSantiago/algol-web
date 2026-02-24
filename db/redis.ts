import Redis from 'ioredis';

export const redis = new Redis({
    host: '127.0.0.1', // ou a URL do seu Redis
    port: 6379,
});