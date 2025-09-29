import { Module } from '@nestjs/common';

import { CacheService } from '@/common/utils/cache.service';
import { UtilsService } from '@/common/utils/utils.service';

@Module({
  providers: [UtilsService, CacheService],
  exports: [UtilsService, CacheService],
})
export class UtilsModule {}
