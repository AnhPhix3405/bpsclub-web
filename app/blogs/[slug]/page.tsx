"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Eye, Share2, BookmarkPlus, Bookmark, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import parse from "html-react-parser";
import { useBlog } from "@/hooks/useBlog";
import { Blog } from "@/lib/services/blogService";
import { Breadcrumb } from "@/components/breadcrumb";
import { ReadingProgress } from "@/components/reading-progress";
import { TableOfContents } from "@/components/table-of-contents";
import { RelatedContent } from "@/components/related-content";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  const { getBlogWithViews, blogs } = useBlog();

  useEffect(() => {
    if (!slug) {
      setError("Missing blog slug");
      setIsLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const blogData = await getBlogWithViews(slug);
        setBlog(blogData || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [slug, getBlogWithViews]);

  useEffect(() => {
    if (blog) {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedBlogs") || "[]");
      setIsBookmarked(bookmarks.includes(blog.blog_uuid));

      const related = blogs
        .filter(
          (b) =>
            b.blog_uuid !== blog.blog_uuid &&
            b.category?.id === blog.category?.id
        )
        .slice(0, 6);
      setRelatedBlogs(related);
    }
  }, [blog, blogs]);

  const toggleBookmark = () => {
    if (!blog) return;

    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedBlogs") || "[]");
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: string) => id !== blog.blog_uuid);
      toast.success("Removed from bookmarks");
    } else {
      newBookmarks = [...bookmarks, blog.blog_uuid];
      toast.success("Added to bookmarks");
    }

    localStorage.setItem("bookmarkedBlogs", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (!blog) return;

    const url = `${window.location.origin}/blogs/${blog.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.short_description,
          url: url,
        });
        toast.success("Shared successfully");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard");
  };

  const renderContent = (content: string) => {
    if (!content) {
      return <p className="text-gray-500">No content available</p>;
    }

    const isHTML = /<[a-z][\s\S]*>/i.test(content);
    return (
      <div className="prose prose-lg max-w-none prose-headings:text-[#004987] prose-links:text-[#004987] prose-strong:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-img:rounded-lg prose-img:shadow-md">
        {isHTML ? parse(content) : <ReactMarkdown>{content}</ReactMarkdown>}
      </div>
    );
  };

  const calculateReadingTime = (content?: string): number => {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString("vi-VN");
    const formattedTime = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { formattedDate, formattedTime };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#004987] border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Blog not found.</p>
      </div>
    );
  }

  const { formattedDate, formattedTime } = formatDateTime(blog.created_at);
  const readingTime = calculateReadingTime(blog.content);

  return (
    <>
      <ReadingProgress />

      <div className="min-h-screen">
        <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={blog.thumbnail_url || "/placeholder.svg"}
              alt={blog.title}
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#004987]/90 to-[#0070b8]/90" />
          </div>

          <div className="container relative z-10 px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Breadcrumb
                items={[
                  { label: "Blogs", href: "/blogs" },
                  { label: blog.category?.name || "Uncategorized", href: `/blogs/categories/${blog.category?.name?.toLowerCase()}` },
                  { label: blog.title },
                ]}
                className="mb-8 text-white/80"
              />

              <Link href="/blogs">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10 mb-8"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to blogs
                </Button>
              </Link>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {blog.category && (
                  <Link href={`/blogs/categories/${blog.category.name.toLowerCase()}`}>
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors mb-4">
                      {blog.category.name}
                    </span>
                  </Link>
                )}

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mb-8 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{readingTime} min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{blog.views} views</span>
                  </div>
                  {blog.author && (
                    <div className="flex items-center gap-2">
                      <span>By {blog.author}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleShare}
                    className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={toggleBookmark}
                    className={`transition-all duration-300 hover:scale-105 ${isBookmarked
                        ? "bg-white text-[#004987]"
                        : "bg-white text-[#004987] hover:bg-gray-100"
                      }`}
                  >
                    {isBookmarked ? (
                      <Bookmark className="mr-2 h-4 w-4 fill-current" />
                    ) : (
                      <BookmarkPlus className="mr-2 h-4 w-4" />
                    )}
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {renderContent(blog.content || blog.short_description)}
                </motion.div>
              </div>

              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                    <h3 className="text-lg font-semibold text-[#004987] mb-4">
                      Article Info
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Published Date
                        </p>
                        <p className="text-gray-900">{formattedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Published Time
                        </p>
                        <p className="text-gray-900">{formattedTime}</p>
                      </div>
                      {blog.category && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Category
                          </p>
                          <Link href={`/blogs/categories/${blog.category.name.toLowerCase()}`}>
                            <p className="text-[#004987] hover:underline">
                              {blog.category.name}
                            </p>
                          </Link>
                        </div>
                      )}
                      {blog.author && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Author</p>
                          <p className="text-gray-900">{blog.author}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Reading Time
                        </p>
                        <p className="text-gray-900">{readingTime} minutes</p>
                      </div>
                    </div>
                  </div>

                  {blog.content && (
                    <TableOfContents content={blog.content} />
                  )}

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                      <h3 className="text-lg font-semibold text-[#004987] mb-4">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors cursor-pointer"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {relatedBlogs.length > 0 && (
          <section className="py-16 md:py-24 bg-gray-50">
            <div className="container px-4 md:px-6">
              <RelatedContent
                items={relatedBlogs}
                type="blog"
                title="Related Blogs"
              />
            </div>
          </section>
        )}
      </div>
    </>
  );
}