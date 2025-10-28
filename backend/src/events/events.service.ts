import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entity/events.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async getAllEvents(sort?: string, limit?: number): Promise<Event[]> {
    const queryBuilder = this.eventRepository.createQueryBuilder('event');

    // Handle sorting
    if (sort) {
      const [field, order] = sort.split('_');
      const orderDirection = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      
      // Validate field exists in entity
      const allowedFields = [
        'views',
        'likes',
        'comments',
        'created_at',
        'updated_at',
        'date',
        'title',
      ];
      if (allowedFields.includes(field)) {
        queryBuilder.orderBy(`event.${field}`, orderDirection);
      } else {
        // Default sort by created_at DESC if invalid field
        queryBuilder.orderBy('event.created_at', 'DESC');
      }
    } else {
      // Default sort by created_at DESC
      queryBuilder.orderBy('event.created_at', 'DESC');
    }

    // Handle limit
    if (limit && limit > 0) {
      queryBuilder.limit(limit);
    }

    return await queryBuilder.getMany();
  }
}
