import { useState, useEffect, useCallback, useRef } from "react";
import { eventService, Event, EventCategory } from "@/lib/services/eventService";
import { toast } from "sonner";

interface UseEventParams {
  sort?: string;
  category?: string;
  search?: string;
}

interface UseEventReturn {
  // Data
  events: Event[];
  categories: EventCategory[];
  
  // Loading states
  loading: boolean;
  categoriesLoading: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentEvents: Event[];
  
  // Filters
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;
  
  // Actions
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  fetchEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>;
  
  // Single event actions
  getEventWithViews: (identifier: string | number) => Promise<Event>;
  incrementEventViews: (uuid: string) => Promise<void>;
  incrementEventLikes: (uuid: string) => Promise<void>;
  incrementEventComments: (uuid: string) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

export const useEvent = (): UseEventReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at_DESC");

  // View tracking protection - prevent double counting
  const viewedEvents = useRef<Set<string>>(new Set());
  
  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(events.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEvents = events.slice(startIndex, endIndex);

  // Fetch events function
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        sort: sortBy,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: searchQuery || undefined,
      };
      
      const data = await eventService.getAllEvents(params);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Không thể tải danh sách sự kiện. Vui lòng kiểm tra kết nối mạng và thử lại.");
      setEvents([]); // Reset events on error
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedCategory, searchQuery]);

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const categoriesData = await eventService.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
      setCategories([]); // Reset categories on error
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Refresh events (for manual refresh)
  const refreshEvents = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  // Get single event and increment views (only once per session)
  const getEventWithViews = useCallback(async (identifier: string | number): Promise<Event> => {
    try {
      // Fetch event data using smart method
      const eventData = await eventService.getEvent(identifier);
      
      // Increment views only if event hasn't been viewed in this session
      if (eventData && eventData.event_uuid && !viewedEvents.current.has(eventData.event_uuid)) {
        try {
          await eventService.incrementViews(eventData.event_uuid);
          viewedEvents.current.add(eventData.event_uuid); // Mark as viewed
        } catch (viewError) {
          console.warn('Failed to increment views:', viewError);
          // Don't throw error for view increment failure
        }
      }
      
      return eventData;
    } catch (error) {
      console.error('Error fetching event with views:', error);
      throw error;
    }
  }, []);

  // Increment event views
  const incrementEventViews = useCallback(async (uuid: string): Promise<void> => {
    try {
      await eventService.incrementViews(uuid);
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }, []);

  // Increment event likes
  const incrementEventLikes = useCallback(async (uuid: string): Promise<void> => {
    try {
      await eventService.incrementLikes(uuid);
    } catch (error) {
      console.error('Error incrementing likes:', error);
      throw error;
    }
  }, []);

  // Increment event comments
  const incrementEventComments = useCallback(async (uuid: string): Promise<void> => {
    try {
      await eventService.incrementComments(uuid);
    } catch (error) {
      console.error('Error incrementing comments:', error);
      throw error;
    }
  }, []);





  // Load data on component mount
  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchEvents();
  }, [selectedCategory, searchQuery, sortBy, fetchEvents]);

  return {
    // Data
    events,
    categories,
    
    // Loading states
    loading,
    categoriesLoading,
    
    // Pagination
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    currentEvents,
    
    // Filters
    selectedCategory,
    searchQuery,
    sortBy,
    
    // Actions
    setCurrentPage,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    fetchEvents,
    refreshEvents,
    
    // Single event actions
    getEventWithViews,
    incrementEventViews,
    incrementEventLikes,
    incrementEventComments,
  };
};
