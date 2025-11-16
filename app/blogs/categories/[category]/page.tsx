"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useBlog } from "@/hooks/useBlog";

export default function BlogCategoryPage() {
  const router = useRouter();
  const params = useParams();
  let categoryName: string = decodeURIComponent(params.category as string);
  categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const {
    blogs,
    categories,
    loading,
    selectedCategory,
    setSelectedCategory,
  } = useBlog();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const categoryOptions = [
    "all",
    ...categories.map((cat) => cat.name),
  ];

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) return;

    setSelectedCategory(category);

    if (category !== "all") {
      category = category.toLowerCase();
      router.push(`/blogs/categories/${encodeURIComponent(category)}`);
    } else {
      router.push(`/blogs/categories/all`);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const categoryParam = Array.isArray(params.category)
      ? params.category[0]
      : params.category;
    return (
      categoryParam === "all" ||
      blog.category?.name?.toLowerCase() === categoryParam?.toLowerCase()
    );
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white overflow-hidden">
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {categoryName} Blogs
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Discover blogs and articles about Blockchain and Web3
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50" ref={ref}>
        <div className="container px-4 md:px-6">
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004987] focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    onClick={() => handleCategoryClick(category)}
                    className={`transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category
                        ? "bg-[#004987] text-white"
                        : "bg-white text-[#004987]"
                    }`}
                  >
                    {category === "all" ? "All categories" : category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#004987] border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          )}

          {!loading && filteredBlogs.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredBlogs.map((blog) => (
                <motion.div
                  key={blog.blog_uuid}
                  variants={itemVariants}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <Image
                      src={
                        blog.thumbnail_url || "/placeholder.jpg"
                      }
                      alt={blog.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#004987] line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3">
                      {blog.short_description}
                    </p>
                    <Link href={`/blogs/${blog.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white transition-colors duration-300"
                      >
                        Read more
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No blogs match your search criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}