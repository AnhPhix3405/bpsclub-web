import { API_BASE_URL } from '@/config/enpoints';

// Types
export type MemberSocial = {
  id: number;
  member_id: number;
  platform: string;
  url: string;
};

export type MemberRole = {
  id: number;
  name: string;
};

export type Board = {
  id: number;
  name: string;
  description: string;
};

export type Member = {
  id: number;
  full_name: string;
  avatar_url: string;
  bio: string;
  board_id: number;
  role_id: number;
  display_order: number;
  is_active: boolean;
  board: Board;
  role: MemberRole;
  socials: MemberSocial[];
};

// Helper function to get social links
export const getSocialUrl = (socials: MemberSocial[], platform: string): string | undefined => {
  return socials.find(s => s.platform.toLowerCase() === platform.toLowerCase())?.url;
};

// API Service
export const teamService = {
  // Get all active members (public endpoint)
  async getAllActiveMembers(): Promise<Member[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/members/get-all-active`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching active members:', error);
      throw error;
    }
  },

  // Get all members (admin endpoint - requires auth)
  async getAllMembers(authToken?: string): Promise<Member[]> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/members`, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching all members:', error);
      throw error;
    }
  },

  // Get member by ID
  async getMemberById(id: number): Promise<Member | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching member ${id}:`, error);
      throw error;
    }
  },

  // Get members by board ID
  async getMembersByBoardId(boardId: number): Promise<Member[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/members/board/${boardId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error(`Error fetching members for board ${boardId}:`, error);
      throw error;
    }
  },

  // Get members by role ID  
  async getMembersByRoleId(roleId: number): Promise<Member[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/members/role/${roleId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error(`Error fetching members for role ${roleId}:`, error);
      throw error;
    }
  },
};

// Utility functions
export const teamUtils = {
  // Group members by board
  groupMembersByBoard(members: Member[]): { [boardName: string]: Member[] } {
    const grouped: { [boardName: string]: Member[] } = {};
    
    members.forEach((member) => {
      const boardName = member.board?.name || 'No Board';
      if (!grouped[boardName]) {
        grouped[boardName] = [];
      }
      grouped[boardName].push(member);
    });
    
    return grouped;
  },

  // Sort boards by priority order
  sortBoardsByPriority(boards: string[], priorityOrder: string[] = []): string[] {
    const defaultOrder = [
      'Advisory Board',
      'Executive Board', 
      'Specialist Board',
      'Media Board',
      'Logistics Board',
      'External Relations Board',
    ];
    
    const order = priorityOrder.length > 0 ? priorityOrder : defaultOrder;
    
    return [
      ...order.filter(board => boards.includes(board)),
      ...boards.filter(board => !order.includes(board)),
    ];
  },

  // Filter members by search query
  filterMembers(members: Member[], searchQuery: string): Member[] {
    if (!searchQuery.trim()) return members;
    
    const query = searchQuery.toLowerCase();
    
    return members.filter((member) =>
      member.full_name.toLowerCase().includes(query) ||
      member.role?.name.toLowerCase().includes(query) ||
      (member.bio && member.bio.toLowerCase().includes(query)) ||
      member.board?.name.toLowerCase().includes(query)
    );
  },

  // Sort members by display order
  sortMembersByDisplayOrder(members: Member[]): Member[] {
    return [...members].sort((a, b) => a.display_order - b.display_order);
  },

  // Paginate array
  paginate<T>(array: T[], page: number, itemsPerPage: number): T[] {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return array.slice(startIndex, endIndex);
  },

  // Get total pages for pagination
  getTotalPages(totalItems: number, itemsPerPage: number): number {
    return Math.ceil(totalItems / itemsPerPage);
  },
};
