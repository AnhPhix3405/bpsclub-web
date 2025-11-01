/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { EventsRepository } from './events.repository';
import { UploadService } from '../upload/upload.service';

export interface CreateEventData {
  title: string;
  date: string;
  time?: string;
  location?: string;
  excerpt?: string;
  registration_link?: string;
  notion_content?: string;
  is_visible?: boolean;
  category_id?: number;
  schedules?: any[];
  speakers?: any[];
  image_file?: {
    path: string;
    originalname: string;
    size: number;
    mimetype: string;
  };
}

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly uploadService: UploadService,
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

  async createEvent(eventData: CreateEventData): Promise<any> {
    try {
      let imageUrl: string | undefined;

      // If an image file is provided, upload it and get the URL
      if (eventData.image_file) {
        const uploadResult = await this.uploadService.uploadSingleFile(
          eventData.image_file.path,
          eventData.image_file.originalname,
          eventData.image_file.size,
          eventData.image_file.mimetype,
        );
        imageUrl = uploadResult.url;
      }

      // Prepare the event data for saving
      const newEvent = {
        ...eventData,
        image: imageUrl, // Use the uploaded image URL
      };

      // Save the event to the repository
      return await this.eventsRepository.createEvent(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }
}
