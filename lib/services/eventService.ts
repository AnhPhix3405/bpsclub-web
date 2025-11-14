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
  slug: string;
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

  async getEventBySlug(slug: string): Promise<Event> {
    try {
      const url = `${this.baseURL}/events/slug/${slug}`;  
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
      console.error('Error fetching event by slug:', error);
      throw error;
    }
  }

  async getEvent(slug: string): Promise<Event> {
    return await this.getEventBySlug(slug);
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

  async incrementViews(slug: string): Promise<{ message: string }> {
    try {
      const url = `${this.baseURL}/events/slug/${slug}/views`;

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
}

export const eventService = new EventService();
export type { Event, GetAllEventsParams, EventCategory, EventSchedule, EventSpeaker };
