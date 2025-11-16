import { API_BASE_URL } from '@/config/enpoints';

interface BlogCategory {
  id: number;
  name: string;
}

interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

interface Blog {
  blog_uuid: string;
  title: string;
  slug: string;
  content: string;
  short_description: string;
  thumbnail_url?: string;
  views: number;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
  author?: string;
  tags?: BlogTag[]; // Added tags property
}

interface GetAllBlogsParams {
  sort?: string;
  limit?: number;
  category?: string;
  search?: string;
}

class BlogService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAllBlogs(params?: GetAllBlogsParams): Promise<Blog[]> {
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

      const url = `${this.baseURL}/blogs/get-all-published${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Blog[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  async getBlogBySlug(slug: string): Promise<Blog> {
    try {
      const url = `${this.baseURL}/blogs/slug/${slug}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Blog = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      throw error;
    }
  }

  async incrementViews(slug: string): Promise<{ message: string }> {
    try {
      const url = `${this.baseURL}/blogs/slug/${slug}/views`;

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

  async getAllCategories(): Promise<BlogCategory[]> {
    try {
      const url = `${this.baseURL}/blogs/categories`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogCategory[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  }
}

export const blogService = new BlogService();
export type { Blog, GetAllBlogsParams, BlogCategory };
