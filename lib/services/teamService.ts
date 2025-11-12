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
  const social = socials.find(s => s.platform.toLowerCase() === platform.toLowerCase());
  return social?.url;
};

// Helper function to get social icon component with support for dynamic platforms
export const getSocialIcon = (platform: string): string => {
  const platformLower = platform.toLowerCase();
  
  // Known platform mappings
  const platformMap: { [key: string]: string } = {
    'github': 'github',
    'linkedin': 'linkedin',
    'twitter': 'twitter',
    'x': 'twitter',
    'facebook': 'facebook',
    'instagram': 'instagram',
    'youtube': 'youtube',
    'tiktok': 'tiktok',
    'email': 'mail',
    'website': 'globe',
    'blog': 'globe',
    'portfolio': 'globe',
    'discord': 'messageCircle',
    'telegram': 'messageCircle',
    'whatsapp': 'messageCircle',
    'slack': 'messageCircle',
    'reddit': 'messageCircle',
    'medium': 'edit',
    'dev.to': 'code',
    'codepen': 'code',
    'stackoverflow': 'helpCircle',
    'behance': 'image',
    'dribbble': 'image',
    'figma': 'figma',
    'twitch': 'video',
    'spotify': 'music',
    'soundcloud': 'music',
  };

  return platformMap[platformLower] || 'externalLink';
};

// Helper function to get platform display name
export const getPlatformDisplayName = (platform: string): string => {
  const platformLower = platform.toLowerCase();
  
  const displayNameMap: { [key: string]: string } = {
    'github': 'GitHub',
    'linkedin': 'LinkedIn',
    'twitter': 'Twitter',
    'x': 'X (Twitter)',
    'facebook': 'Facebook',
    'instagram': 'Instagram',
    'youtube': 'YouTube',
    'tiktok': 'TikTok',
    'email': 'Email',
    'website': 'Website',
    'blog': 'Blog',
    'portfolio': 'Portfolio',
    'discord': 'Discord',
    'telegram': 'Telegram',
    'whatsapp': 'WhatsApp',
    'slack': 'Slack',
    'reddit': 'Reddit',
    'medium': 'Medium',
    'dev.to': 'Dev.to',
    'codepen': 'CodePen',
    'stackoverflow': 'Stack Overflow',
    'behance': 'Behance',
    'dribbble': 'Dribbble',
    'figma': 'Figma',
    'twitch': 'Twitch',
    'spotify': 'Spotify',
    'soundcloud': 'SoundCloud',
  };

  return displayNameMap[platformLower] || platform.charAt(0).toUpperCase() + platform.slice(1);
};

// Helper function to check if URL is valid
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Helper function to format social URL properly
export const formatSocialUrl = (url: string, platform: string): string => {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's an email, add mailto:
  if (platform.toLowerCase() === 'email' || url.includes('@')) {
    return url.startsWith('mailto:') ? url : `mailto:${url}`;
  }
  
  // Add https:// for other platforms if missing
  return `https://${url}`;
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
