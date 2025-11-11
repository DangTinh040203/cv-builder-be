import { Module } from '@nestjs/common';

import { CacheService } from '@/lib/utils/cache.service';
import { UtilsService } from '@/lib/utils/utils.service';

@Module({
  providers: [UtilsService, CacheService],
  exports: [UtilsService, CacheService],
})
export class UtilsModule {}
