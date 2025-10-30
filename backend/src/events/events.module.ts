import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';
import { Event } from './entity/events.entity';
import { EventCategory } from './entity/event_categories.entity';
import { EventSchedule } from './entity/event_schedules.entity';
import { EventSpeaker } from './entity/event_speakers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Event,
      EventCategory,
      EventSchedule,
      EventSpeaker,
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsRepository],
  exports: [EventsService, EventsRepository],
})
export class EventsModule {}
