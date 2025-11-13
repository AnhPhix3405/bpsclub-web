"use client";

import ReactMarkdown from "react-markdown";
import parse from "html-react-parser";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  ArrowLeft,
  Share2,
  BookmarkPlus,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { eventService, Event, EventSchedule } from "@/lib/services/eventService";
import { useEvent } from "@/hooks/useEvent";

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

// Helper: format time as HH:mm
function formatTime(timeString?: string) {
  if (!timeString || timeString === "00:00") return "";
  // Nếu timeString là HH:mm:ss hoặc HH:mm, chỉ lấy HH:mm
  return timeString.slice(0, 5);
}

// Helper: detect if content is HTML or Markdown
function isHTML(content: string): boolean {
  // Check for HTML tags
  const htmlTagPattern = /<[a-z][\s\S]*>/i;
  return htmlTagPattern.test(content);
}

// Helper: render content based on type (HTML or Markdown)
function renderContent(content: string) {
  if (!content) {
    return <p className="text-gray-500">Không có nội dung</p>;
  }

  // If content contains HTML tags, use html-react-parser
  if (isHTML(content)) {
    console.log('Rendering HTML content:', content.substring(0, 100) + '...');
    return (
      <div className="prose max-w-none prose-headings:text-[#004987] prose-links:text-[#004987] prose-strong:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700">
        {parse(content)}
      </div>
    );
  }

  // Otherwise, use ReactMarkdown for Markdown content
  console.log('Rendering Markdown content:', content.substring(0, 100) + '...');
  return (
    <div className="prose max-w-none prose-headings:text-[#004987] prose-links:text-[#004987] prose-strong:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  // Use id as the parameter for the event
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the useEvent hook for event operations
  const { getEventWithViews } = useEvent();

  // --- Additions for tag/category filtering and child events ---
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [childEvents, setChildEvents] = useState<Event[]>([]);
  const [isChildLoading, setIsChildLoading] = useState(false);

  // You can replace this with a dynamic fetch if needed
  const categories = ["all", "Seminar", "Hackathon", "Workshop", "Community"];

  // Fetch related events from API (by category, exclude current event)
  useEffect(() => {
    if (!event || !event.category) return;
    setIsChildLoading(true);
    eventService.getAllEvents({ category: event.category.name })
      .then((data) => {
        if (data && Array.isArray(data)) {
          // Exclude the current event itself
          setChildEvents(data.filter((e: Event) => e.id !== event.id));
        } else {
          setChildEvents([]);
        }
      })
      .catch(() => setChildEvents([]))
      .finally(() => setIsChildLoading(false));
  }, [event]);

  // Fetch event data by id
  useEffect(() => {
    if (!eventId) {
      setError("Missing event id");
      setIsLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Use the hook's method which automatically increments views
        const eventData = await getEventWithViews(eventId);
        setEvent(eventData || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, getEventWithViews]); // Re-fetch if eventId changes

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#004987] border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Event information is loading...</p>
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
          Thử lại
        </Button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No events were found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={event.image || ""}
            alt={event.title}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#004987]/50 to-[#0070b8]/40" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Link href="/events">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 mb-8"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to events
              </Button>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${event.status === "upcoming"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {event.status === "upcoming" ? "Upcoming" : "Ended"}
                </span>
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  {event.category?.name || 'Uncategorized'}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {event.title}
              </h1>

              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {event.schedules && event.schedules.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-[#004987] mt-12 mb-6">
                      Schedule
                    </h2>
                    <div className="space-y-4">
                      {event.schedules.map(
                        (item: EventSchedule, index: number) => (
                          <div
                            key={index}
                            className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="w-32 flex-shrink-0">
                              <span className="text-sm font-medium text-[#004987]">
                                {item.time}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatDate(item.date)}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}

                {/* Speakers section removed as requested */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="flex items-center text-white/90">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  {formatTime(event.time) && (
                    <div className="flex items-center text-white/90">
                      <Clock className="w-5 h-5 mr-2" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                  )}
                  <div className="flex items-center text-white/90">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  {event.registration_link && (
                    <Link href={event.registration_link}>
                      <Button
                        size="lg"
                        className="bg-white text-[#004987] hover:bg-gray-100"
                      >
                        Register
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
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
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#004987]">
                    Event introduction
                  </h2>
                </div>
                {renderContent(event.notion_content || "")}

                {event.schedules && event.schedules.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-[#004987] mt-12 mb-6">
                      Lịch trình
                    </h2>
                    <div className="space-y-4">
                      {event.schedules.map(
                        (item: EventSchedule, index: number) => (
                          <div
                            key={index}
                            className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="w-32 flex-shrink-0">
                              <span className="text-sm font-medium text-[#004987]">
                                {item.time}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatDate(item.date)}
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {item.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}

                {/* Speakers section removed as requested */}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="sticky top-8"
              >
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#004987] mb-4">
                    Event Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Time</p>
                      <p className="text-gray-900">
                        {formatDate(event.date)}
                        {formatTime(event.time) &&
                          ` | ${formatTime(event.time)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Location
                      </p>
                      <p className="text-gray-900">{event.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Category
                      </p>
                      <p className="text-gray-900">{event.category?.name || 'Uncategorized'}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    {event.registration_link && (
                      <Link href={event.registration_link}>
                        <Button className="w-full bg-[#004987] text-white hover:bg-[#003d6d]">
                          Đăng ký tham gia
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Child Events Section - move to end of page */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-xl font-semibold mb-4 text-[#004987]">
            Related Events
          </h2>
          {isChildLoading ? (
            <div>Loading...</div>
          ) : childEvents.length === 0 ? (
            <div>No related events</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {childEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden group">
                    <Image
                      src={
                        !event.image
                          ? "/placeholder.svg"
                          : event.image.startsWith("http") ||
                            event.image.startsWith("/")
                            ? event.image
                            : "/" + event.image
                      }
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium bg-[#004987] text-white rounded-full">
                        {event.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* Date and Time Row */}
                    <div className="flex items-center text-sm text-gray-500 mb-2 gap-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {formatTime(event.time) && (
                        <>
                          <span className="mx-1 text-gray-400">|</span>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{formatTime(event.time)}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#004987] line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3">
                      {event.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{event.views || 0} lượt xem</span>
                    </div>
                    <Link href={`/events/${event.event_uuid || event.id}`}>
                      <Button
                        variant="outline"
                        className="w-full text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white transition-colors duration-300"
                      >
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
