"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowLeft,
  Eye,
  Clock,
  ChevronRight,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import { NewsArticle, NewsArticleResponse } from "@/app/api/news/types";
import { Tag } from "lucide-react";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otherNews, setOtherNews] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (!newsId) return;
    setIsLoading(true);
    setError(null);
    fetch(`/api/news/${newsId}`)
      .then((res) => res.json())
      .then((data: NewsArticleResponse) => {
        if (data && data.data) setNews(data.data);
        else setError("News not found");
      })
      .catch(() => setError("News not found"))
      .finally(() => setIsLoading(false));
  }, [newsId]);

  // Fetch other news only after current news is loaded
  useEffect(() => {
    if (!news) return;
    fetch(`/api/news`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.data)) {
          setOtherNews(
            data.data.filter((n: NewsArticle) => n.id !== news.id).slice(0, 3)
          );
        } else {
          setOtherNews([]);
        }
      })
      .catch(() => setOtherNews([]));
  }, [news]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#004987] border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading article...</p>
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
  if (!news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">News not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={news.image || "/placeholder.svg"}
            alt={news.title}
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#004987]/90 to-[#0070b8]/90" />
        </div>
        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/news">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 mb-8"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to news
              </Button>
            </Link>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {news.category}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                {news.tags && news.tags.length > 0 ? news.tags[0] : "Tin tức"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {news.title}
            </h1>
            {/* Info Row: only date, views, author */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-white/90">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>{news.date}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                <span>{news.views} views</span>
              </div>
              <div className="flex items-center">
                <span>Author: {news.author?.name}</span>
              </div>
            </div>
            {/* Action Buttons */}
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

      {/* News Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#004987] mb-6">
                Article content
              </h2>
              <div
                className="prose max-w-none mb-8"
                dangerouslySetInnerHTML={{
                  __html: news.content || news.excerpt,
                }}
              />
            </div>
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-[#004987] mb-4">
                  Article info
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Published
                    </p>
                    <p className="text-gray-900">{news.date}</p>
                  </div>
                  {news.time && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time</p>
                      <p className="text-gray-900">{news.time}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Category
                    </p>
                    <p className="text-gray-900">{news.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other News Section */}
      {otherNews.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-xl font-semibold mb-4 text-[#004987]">
              Other articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherNews.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-2 py-1 text-xs font-medium bg-[#004987] text-white rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-10 h-10">
                        <Image
                          src={item.author.image}
                          alt={item.author.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.author.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.author.role}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-[#004987] mb-3 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{item.date}</span>
                        </div>
                        {item.time && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{item.time}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{item.views} views</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full flex items-center"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <Link href={`/news/${item.id}`}>
                        <Button
                          variant="outline"
                          className="text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white transition-colors duration-300"
                        >
                          Read more
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-[#004987]"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-[#004987]"
                        >
                          <BookmarkPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
