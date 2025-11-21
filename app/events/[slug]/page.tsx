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
  Bookmark,
  Eye,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { eventService, Event } from "@/lib/services/eventService";
import { useEvent } from "@/hooks/useEvent";
import { Breadcrumb } from "@/components/breadcrumb";
import { CountdownTimer } from "@/components/countdown-timer";
import { EventTimeline } from "@/components/event-timeline";
import { RelatedContent } from "@/components/related-content";

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function formatTime(timeString?: string) {
  if (!timeString || timeString === "00:00") return "";
  return timeString.slice(0, 5);
}

function isHTML(content: string): boolean {
  const htmlTagPattern = /<[a-z][\s\S]*>/i;
  return htmlTagPattern.test(content);
}

function renderContent(content: string) {
  if (!content) {
    return <p className="text-gray-500">No content available</p>;
  }

  if (isHTML(content)) {
    return (
      <div className="prose prose-lg max-w-none prose-headings:text-[#004987] prose-links:text-[#004987] prose-strong:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-img:rounded-lg prose-img:shadow-md">
        {parse(content)}
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none prose-headings:text-[#004987] prose-links:text-[#004987] prose-strong:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default function EventDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);

  const { getEventWithViews } = useEvent();

  useEffect(() => {
    if (!slug) {
      setError("Missing event slug");
      setIsLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const eventData = await getEventWithViews(slug);
        setEvent(eventData || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        toast.error("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [slug, getEventWithViews]);

  useEffect(() => {
    if (event) {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarkedEvents") || "[]");
      setIsBookmarked(bookmarks.includes(event.event_uuid));

      if (event.category) {
        eventService
          .getAllEvents({ category: event.category.name })
          .then((data) => {
            if (data && Array.isArray(data)) {
              setRelatedEvents(
                data.filter((e: Event) => e.event_uuid !== event.event_uuid).slice(0, 6)
              );
            }
          })
          .catch(() => setRelatedEvents([]));
      }
    }
  }, [event]);

  const toggleBookmark = () => {
    if (!event) return;

    const bookmarks = JSON.parse(localStorage.getItem("bookmarkedEvents") || "[]");
    let newBookmarks;

    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: string) => id !== event.event_uuid);
      toast.success("Removed from bookmarks");
    } else {
      newBookmarks = [...bookmarks, event.event_uuid];
      toast.success("Added to bookmarks");
    }

    localStorage.setItem("bookmarkedEvents", JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (!event) return;

    const url = `${window.location.origin}/events/${event.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.excerpt,
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

  const downloadICS = () => {
    if (!event) return;

    const eventDate = new Date(event.date || "");
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${eventDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.excerpt || ""}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.slug}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Event added to calendar");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#004987] border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading event...</p>
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

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Event not found.</p>
      </div>
    );
  }

  const isUpcoming = new Date(event.date || "") > new Date();

  return (
    <div className="min-h-screen">
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={event.image || "/placeholder.svg"}
            alt={event.title}
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#004987]/70 to-[#0070b8]/70" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb
              items={[
                { label: "Events", href: "/events" },
                { label: event.category?.name || "Uncategorized", href: `/events/categories/${event.category?.name?.toLowerCase()}` },
                { label: event.title },
              ]}
              className="mb-8 text-white/80"
            />

            <Link href="/events">
              <Button variant="ghost" className="text-white hover:bg-white/10 mb-8">
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
                  className={`px-3 py-1 text-sm font-medium rounded-full ${isUpcoming
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                    }`}
                >
                  {isUpcoming ? "Upcoming" : "Past Event"}
                </span>
                {event.category && (
                  <Link href={`/events/categories/${event.category.name.toLowerCase()}`}>
                    <span className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
                      {event.category.name}
                    </span>
                  </Link>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {event.title}
              </h1>

              {isUpcoming && event.date && (
                <div className="mb-8">
                  <p className="text-white/80 mb-4 text-lg">Event starts in:</p>
                  <CountdownTimer targetDate={event.date} />
                </div>
              )}

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
                <div className="flex items-center text-white/90">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>{event.views || 0} views</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {event.registration_link && isUpcoming && (
                  <Link href={event.registration_link} target="_blank">
                    <Button
                      size="lg"
                      className="bg-white text-[#004987] hover:bg-gray-100"
                    >
                      Register Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={downloadICS}
                  className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Add to Calendar
                </Button>
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
                <h2 className="text-2xl font-bold text-[#004987] mb-6">
                  About This Event
                </h2>
                {renderContent(event.notion_content || event.excerpt || "")}

                {event.schedules && event.schedules.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#004987] mb-6">
                      Event Schedule
                    </h2>
                    <EventTimeline
                      schedules={event.schedules.map(s => ({
                        time: s.time,
                        date: s.date || "",
                        title: s.title,
                        description: s.description || ""
                      }))}
                    />
                  </div>
                )}

                {event.speakers && event.speakers.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#004987] mb-6">
                      Speakers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {event.speakers.map((speaker, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              {speaker.avatar_img ? (
                                <Image
                                  src={speaker.avatar_img}
                                  alt={speaker.name}
                                  width={80}
                                  height={80}
                                  className="rounded-full object-cover border-4 border-[#004987]/10"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#004987] to-[#0070b8] flex items-center justify-center text-white text-2xl font-bold">
                                  {speaker.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {speaker.name}
                              </h3>
                              {speaker.role && (
                                <p className="text-sm text-[#004987] font-medium mb-2">
                                  {speaker.role}
                                </p>
                              )}
                              {speaker.bio && (
                                <p className="text-sm text-gray-600 line-clamp-3">
                                  {speaker.bio}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="sticky top-8 space-y-6"
              >
                <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-[#004987] mb-4">
                    Event Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date & Time</p>
                      <p className="text-gray-900">
                        {formatDate(event.date)}
                        {formatTime(event.time) && ` | ${formatTime(event.time)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{event.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Category</p>
                      <Link href={`/events/categories/${event.category?.name?.toLowerCase()}`}>
                        <p className="text-[#004987] hover:underline">
                          {event.category?.name || "Uncategorized"}
                        </p>
                      </Link>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className="text-gray-900">
                        {isUpcoming ? "Upcoming" : "Completed"}
                      </p>
                    </div>
                  </div>

                  {event.registration_link && isUpcoming && (
                    <div className="mt-6">
                      <Link href={event.registration_link} target="_blank">
                        <Button className="w-full bg-[#004987] text-white hover:bg-[#003d6d]">
                          Register Now
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-[#004987] mb-4">
                    Share Event
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="w-full justify-start"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Event
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadICS}
                      className="w-full justify-start"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {relatedEvents.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <RelatedContent
              items={relatedEvents}
              type="event"
              title="Related Events"
            />
          </div>
        </section>
      )}
    </div>
  );
}
