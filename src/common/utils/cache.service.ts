import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private buildKey(parts: Array<string>): string {
    return parts.filter(Boolean).join(':');
  }

  async set<T>(keyParts: Array<string>, value: T, ttlSeconds: number) {
    const key = this.buildKey(keyParts);
    await this.cache.set(key, JSON.stringify(value), ttlSeconds);
  }

  async get<T>(keyParts: Array<string>): Promise<T | null> {
    const key = this.buildKey(keyParts);
    const raw = await this.cache.get<string>(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async del(keyParts: Array<string>) {
    const key = this.buildKey(keyParts);
    await this.cache.del(key);
  }
}
