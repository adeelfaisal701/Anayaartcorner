import { Module } from '@nestjs/common';
import { PortraitsController } from './portraits.controller';

@Module({
  controllers: [PortraitsController],
})
export class PortraitsModule {}
