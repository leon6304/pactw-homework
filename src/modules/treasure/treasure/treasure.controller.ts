import { Controller, Get, Post } from '@nestjs/common';
import { TreasureService } from './treasure.service';
@Controller('treasure')
export class TreasureController {
  constructor(private readonly treasureService: TreasureService) {}
  @Get('value')
  async getValue(): Promise<{ treasure: string }> {
    return await this.treasureService.getValues();
  }
  @Post('addOne')
  async addOne(): Promise<{ treasure: string }> {
    return await this.treasureService.addOne();
  }
}
