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
  };
};
