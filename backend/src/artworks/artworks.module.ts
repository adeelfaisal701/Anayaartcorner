import { Module } from '@nestjs/common';
import { ArtworksController } from './artworks.controller';

@Module({
  controllers: [ArtworksController],
})
export class ArtworksModule {}
