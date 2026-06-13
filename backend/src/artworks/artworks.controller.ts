import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('artworks')
@Controller('artworks')
export class ArtworksController {
  @Public()
  @Get()
  findAll() {
    return [];
  }
}
