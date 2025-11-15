"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, Eye, Share2, BookmarkPlus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import parse from "html-react-parser";
import { useBlog } from "@/hooks/useBlog";
 import { Blog } from "@/lib/services/blogService";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getBlogWithViews } = useBlog();

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#004987] border-t-transparent"></div>
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

  const renderContent = (content: string) => {
    if (!content) {
      return <p className="text-gray-500">No content available</p>;
    }

    const isHTML = /<[a-z][\s\S]*>/i.test(content);
    return (
      <div className="prose max-w-none prose-headings:text-[#004987] prose-links:text-[#004987] prose-strong:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700">
        {isHTML ? parse(content) : <ReactMarkdown>{content}</ReactMarkdown>}
      </div>
    );
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = formatDateTime(blog.created_at);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
            <Link href="/blogs">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 mb-8"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to blogs
              </Button>
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-8 text-white/90">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                <span>{blog.views} views</span>
              </div>
            </div>
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                <BookmarkPlus className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#004987] mb-6">
                Article content
              </h2>
              <div className="prose max-w-none mb-8">
                {renderContent(blog.content || blog.short_description)}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
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
                      <p className="text-gray-900">{blog.category.name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Author</p>
                    <p className="text-gray-900">{blog.author}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}