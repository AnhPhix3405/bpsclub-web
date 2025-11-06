const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Board {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

class BoardService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAllBoards(): Promise<Board[]> {
    try {
      const response = await fetch(`${this.baseURL}/boards/get-all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Board[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }
}

export const boardService = new BoardService();
export type { Board };