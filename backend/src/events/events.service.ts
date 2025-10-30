/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsRepository } from './events.repository';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
  ) {}

  async getAllEvents(
    sort?: string,
    limit?: number,
    category?: string,
    search?: string,
  ): Promise<any[]> {
    return await this.eventsRepository.findAllEvents(sort, limit, category, search);
  }

  async getEventById(id: number): Promise<any> {
    // Find the event with category relation
    const event = await this.eventsRepository.findEventById(id);
    
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Get schedules and speakers
    const [schedules, speakers] = await Promise.all([
      this.eventsRepository.findEventSchedulesByEventId(id),
      this.eventsRepository.findEventSpeakersByEventId(id),
    ]);

    return {
      ...event,
      schedules: schedules,
      speakers: speakers,
    };
  }

  // Additional service methods using repository
  async getAllCategories(): Promise<any[]> {
    return await this.eventsRepository.findAllCategories();
  }

  async getCategoryById(id: number): Promise<any> {
    const category = await this.eventsRepository.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async incrementEventViews(id: number): Promise<void> {
    const event = await this.eventsRepository.findEventById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.eventsRepository.incrementViews(id);
  }

  async incrementEventLikes(id: number): Promise<void> {
    const event = await this.eventsRepository.findEventById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.eventsRepository.incrementLikes(id);
  }

  async incrementEventComments(id: number): Promise<void> {
    const event = await this.eventsRepository.findEventById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    await this.eventsRepository.incrementComments(id);
  }
}
