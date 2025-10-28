import { API_BASE_URL, buildEndpoint } from '@/config/enpoints';

interface Event {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
  excerpt?: string;
  image?: string;
  category: string;
  views: number;
  likes: number;
  comments: number;
  status?: string;
  registration_link?: string;
  notion_content?: string;
  created_at: string;
  updated_at: string;
}

interface GetAllEventsParams {
  sort?: string;
  limit?: number;
}

class EventService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAllEvents(params?: GetAllEventsParams): Promise<Event[]> {
    try {
      const endpoint = buildEndpoint.events.getAll(params);
      const url = `${this.baseURL}${endpoint}`;
      
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
}

export const eventService = new EventService();
export type { Event, GetAllEventsParams };
