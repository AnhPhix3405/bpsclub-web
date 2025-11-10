import { API_BASE_URL } from '@/config/enpoints';
interface EventCategory {
  id: number;
  name: string;
}

interface EventSchedule {
  id: number;
  event_id: number;
  time: string;
  title: string;
  description?: string;
  date?: string;
}

interface EventSpeaker {
  id: number;
  event_id: number;
  name: string;
  role?: string;
  avatar_img?: string;
  bio?: string;
}

interface Event {
  id: number;
  event_uuid: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  specific_location?: string;
  excerpt?: string;
  image?: string;
  views: number;
  likes: number;
  comments: number;
  status?: string;
  registration_link?: string;
  notion_content?: string;
  is_visible?: boolean;
  created_at: string;
  updated_at: string;
  category_id?: number;
  category?: EventCategory;
  schedules?: EventSchedule[];
  speakers?: EventSpeaker[];
}


interface GetAllEventsParams {
  sort?: string;
  limit?: number;
  category?: string;
  search?: string;
}

class EventService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }


  async getAllEvents(params?: GetAllEventsParams): Promise<Event[]> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.sort) {
        queryParams.append('sort', params.sort);
      }

      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }

      if (params?.category && params.category.trim() !== '') {
        queryParams.append('category', params.category);
      }

      if (params?.search && params.search.trim() !== '') {
        queryParams.append('search', params.search);
      }

      const url = `${this.baseURL}/events/get-all-active${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Event[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  async getEventById(id: number): Promise<Event> {
    try {
      const url = `${this.baseURL}/events/${id}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Event = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  async getEventByUuid(uuid: string): Promise<Event> {
    try {
      const url = `${this.baseURL}/events/uuid/${uuid}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Event = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching event by UUID:', error);
      throw error;
    }
  }

  // Helper method to determine if string is UUID format
  private isUuid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  // Smart method that can handle both ID and UUID
  async getEvent(identifier: string | number): Promise<Event> {
    // If it's a number or numeric string, use getEventById
    if (typeof identifier === 'number' || !isNaN(Number(identifier))) {
      return await this.getEventById(Number(identifier));
    }
    
    // If it looks like a UUID, use getEventByUuid
    if (this.isUuid(identifier)) {
      return await this.getEventByUuid(identifier);
    }
    
    // Otherwise, try as ID first, then UUID if that fails
    try {
      return await this.getEventById(Number(identifier));
    } catch (error) {
      console.warn('Failed to get event by ID, trying UUID:', error);
      return await this.getEventByUuid(identifier);
    }
  }

  async getAllCategories(): Promise<EventCategory[]> {
    try {
      const url = `${this.baseURL}/events/categories`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EventCategory[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async incrementViews(uuid: string): Promise<{ message: string }> {
    try {
      const url = `${this.baseURL}/events/uuid/${uuid}/views`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }

  async incrementLikes(uuid: string): Promise<{ message: string }> {
    try {
      const url = `${this.baseURL}/events/uuid/${uuid}/likes`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error incrementing likes:', error);
      throw error;
    }
  }

  async incrementComments(uuid: string): Promise<{ message: string }> {
    try {
      const url = `${this.baseURL}/events/uuid/${uuid}/comments`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error incrementing comments:', error);
      throw error;
    }
  }
}

export const eventService = new EventService();
export type { Event, GetAllEventsParams, EventCategory, EventSchedule, EventSpeaker };
