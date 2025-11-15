import { useState, useEffect, useCallback, useRef } from "react";
import { blogService, Blog, BlogCategory } from "@/lib/services/blogService";
import { toast } from "sonner";

interface UseBlogParams {
  sort?: string;
  category?: string;
  search?: string;
}

interface UseBlogReturn {
  // Data
  blogs: Blog[];
  categories: BlogCategory[];

  // Loading states
  loading: boolean;
  categoriesLoading: boolean;

  // Pagination
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  currentBlogs: Blog[];

  // Filters
  selectedCategory: string;
  searchQuery: string;
  sortBy: string;

  // Actions
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  fetchBlogs: () => Promise<void>;
  refreshBlogs: () => Promise<void>;

  // Single blog actions
  getBlogWithViews: (slug: string) => Promise<Blog>;
  incrementBlogViews: (slug: string) => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

export const useBlog = (): UseBlogReturn => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Filters and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at_DESC");

  // View tracking protection - prevent double counting
  const viewedBlogs = useRef<Set<string>>(new Set());

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(blogs.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  // Fetch blogs function
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        sort: sortBy,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        search: searchQuery || undefined,
      };

      const data = await blogService.getAllBlogs(params);
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Không thể tải danh sách bài viết. Vui lòng kiểm tra kết nối mạng và thử lại.");
      setBlogs([]); // Reset blogs on error
    } finally {
      setLoading(false);
    }
  }, [sortBy, selectedCategory, searchQuery]);

  // Fetch categories function
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const categoriesData = await blogService.getAllCategories(); // Corrected to fetch categories instead of blogs
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục");
      setCategories([]); // Reset categories on error
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Refresh blogs (for manual refresh)
  const refreshBlogs = useCallback(async () => {
    await fetchBlogs();
  }, [fetchBlogs]);

  // Get single blog and increment views (only once per session)
  const getBlogWithViews = useCallback(async (slug: string): Promise<Blog> => {
    try {
      // Fetch blog data using slug
      const blogData = await blogService.getBlogBySlug(slug);

      // Increment views only if blog hasn't been viewed in this session
      if (blogData && blogData.slug && !viewedBlogs.current.has(blogData.slug)) {
        viewedBlogs.current.add(blogData.slug); // Mark as viewed
        try {
          await blogService.incrementViews(blogData.slug);
        } catch (viewError) {
          console.warn('Failed to increment views:', viewError);
          // Don't throw error for view increment failure
        }
      }

      return blogData;
    } catch (error) {
      console.error('Error fetching blog with views:', error);
      throw error;
    }
  }, []);

  // Increment blog views
  const incrementBlogViews = useCallback(async (slug: string): Promise<void> => {
    try {
      await blogService.incrementViews(slug);
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refetch when filters change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchBlogs();
  }, [selectedCategory, searchQuery, sortBy, fetchBlogs]);

  return {
    // Data
    blogs,
    categories,

    // Loading states
    loading,
    categoriesLoading,

    // Pagination
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    currentBlogs,

    // Filters
    selectedCategory,
    searchQuery,
    sortBy,

    // Actions
    setCurrentPage,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    fetchBlogs,
    refreshBlogs,

    // Single blog actions
    getBlogWithViews,
    incrementBlogViews,
  };
};
