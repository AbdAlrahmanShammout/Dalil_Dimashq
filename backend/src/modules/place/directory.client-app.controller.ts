import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiAudience } from '@/common/auth/principal.interface';
import { Audience } from '@/common/decorators/route/audience.decorator';
import { PublicRoute } from '@/common/decorators/route/public-route.decorator';
import { DirectoryService } from '@/modules/place/directory.service';
import { DirectoryResponseDto } from '@/modules/place/dto/response/directory-response.dto';

@ApiTags('directory')
@Audience(ApiAudience.ClientApp)
@Controller('client-app/directory')
export class DirectoryClientAppController {
  constructor(private readonly directoryService: DirectoryService) {}

  @PublicRoute()
  @Get()
  async listDirectory(): Promise<DirectoryResponseDto> {
    const items = await this.directoryService.listDirectory();
    return new DirectoryResponseDto(items);
  }
}
