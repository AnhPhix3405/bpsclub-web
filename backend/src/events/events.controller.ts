import { Controller, Get, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entity/events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('get-all')
  async getAllEvents(
    @Query('sort') sort?: string,
    @Query('limit') limit?: string,
  ): Promise<Event[]> {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return await this.eventsService.getAllEvents(sort, limitNum);
  }
}
