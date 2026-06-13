import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CreatePortraitRequestDto } from './dto/create-portrait-request.dto';

@ApiTags('portraits')
@Controller('portraits')
export class PortraitsController {
  @Public()
  @Post()
  create(@Body() dto: CreatePortraitRequestDto) {
    return {
      message: 'Portrait request received',
      request: dto,
    };
  }
}
