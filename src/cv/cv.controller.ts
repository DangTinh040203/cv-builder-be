import { Controller } from '@nestjs/common';

import { CvService } from '@/cv/services/cv.service';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}
}
