import { useState, useEffect, useCallback } from "react";
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
  handleDelete: (eventId: number) => Promise<void>;
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
      // Mock categories - replace with actual API call when available
      const mockCategories: EventCategory[] = [
        { id: 1, name: "Workshop" },
        { id: 2, name: "Seminar" },
        { id: 3, name: "Conference" },
        { id: 4, name: "Meetup" },
        { id: 5, name: "Hackathon" },
      ];
      setCategories(mockCategories);
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

  // Handle delete function
  const handleDelete = useCallback(async (eventId: number) => {
    try {
      // Mock delete - replace with actual API call
      // await eventService.deleteEvent(eventId);
      
      toast.success(`Đã xóa sự kiện #${eventId}`);
      await refreshEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Không thể xóa sự kiện. Vui lòng thử lại.");
    }
  }, [refreshEvents]);

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
    handleDelete,
  };
};
