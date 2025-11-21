"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedDivider } from "@/components/ui/animated-section";
import { useBlog } from "@/hooks/useBlog";
import { useRouter } from "next/navigation";
import { FilterBar } from "@/components/filter-bar";
import { BlogCard } from "@/components/blog-card";
import { SkeletonCard } from "@/components/skeleton-card";

export default function BlogPage() {
  const router = useRouter();
  const {
    blogs,
    categories,
    loading,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
  } = useBlog();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  const categoryOptions = ["all", ...categories.map((cat) => cat.name)];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);

    if (category !== "all") {
      const categoryLower = category.toLowerCase();
      router.push(`/blogs/categories/${categoryLower}`);
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (sortBy === "popular") {
      return b.views - a.views;
    } else if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedBlogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = sortedBlogs.slice(startIndex, startIndex + blogsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute -top-10 -left-10 w-[300px] h-[300px] bg-white opacity-5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-blue-500 opacity-5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>

        <div className="container relative z-10 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              News & Events
            </h1>
            <AnimatedDivider className="w-24 h-1 bg-white mx-auto mb-8" />

            <p className="text-lg md:text-xl text-white/90 mb-8">
              Stay updated with the latest news and activities of the Blockchain Pioneer Student Club
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50" ref={ref}>
        <div className="container px-4 md:px-6">
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categoryOptions}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { value: "latest", label: "Latest" },
              { value: "popular", label: "Most Popular" },
              { value: "alphabetical", label: "A-Z" },
            ]}
            onCategoryClick={handleCategoryClick}
          />

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonCard variant="blog" count={6} />
            </div>
          )}

          {!loading && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentBlogs.map((blog, index) => (
                  <BlogCard key={blog.blog_uuid} blog={blog} index={index} />
                ))}
              </motion.div>

              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-12 flex justify-center items-center gap-2"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-gray-500">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page as number)}
                          className={`min-w-[40px] ${currentPage === page
                              ? "bg-[#004987] text-white hover:bg-[#003b6d]"
                              : "hover:bg-gray-100"
                            }`}
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </>
          )}

          {!loading && blogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No blogs found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  variant="outline"
                  className="text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white"
                >
                  Clear filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
