import { Module } from '@nestjs/common';
import { DemographicsController } from './demographics.controller.js';
import { DemographicsService } from './demographics.service.js';

@Module({
  controllers: [DemographicsController],
  providers: [DemographicsService]
})
export class DemographicsModule {}
