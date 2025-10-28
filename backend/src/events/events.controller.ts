import { Controller, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { Event } from './entity/events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('get-all')
  async getAllEvents(): Promise<Event[]> {
    return await this.eventsService.getAllEvents();
  }
}
