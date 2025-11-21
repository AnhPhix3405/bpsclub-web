"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  AnimatedSection,
  AnimatedHeading,
  AnimatedDivider,
} from "@/components/ui/animated-section";
import { eventService, Event } from "@/lib/services/eventService";
import { FilterBar } from "@/components/filter-bar";
import { EventCard } from "@/components/event-card";
import { SkeletonCard } from "@/components/skeleton-card";
import { Breadcrumb } from "@/components/breadcrumb";

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function formatTime(timeString?: string) {
  if (!timeString || timeString === "00:00") return "";
  return timeString.slice(0, 5);
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  let categoryName: string = decodeURIComponent(params.category as string);
  categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getAllEvents({
          category: categoryName,
          search: searchQuery || undefined,
        });
        setEvents(data);
      } catch (error) {
        console.error("Error fetching category events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryEvents();
  }, [categoryName, searchQuery]);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
    } else if (sortBy === "popular") {
      return (b.views || 0) - (a.views || 0);
    } else if (sortBy === "upcoming") {
      const now = new Date().getTime();
      const aTime = new Date(a.date || "").getTime();
      const bTime = new Date(b.date || "").getTime();
      return Math.abs(aTime - now) - Math.abs(bTime - now);
    } else if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = sortedEvents.slice(startIndex, startIndex + eventsPerPage);

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

  const upcomingCount = events.filter(
    (e) => new Date(e.date || "") > new Date()
  ).length;

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
          <AnimatedSection className="max-w-3xl mx-auto">
            <Breadcrumb
              items={[
                { label: "Events", href: "/events" },
                { label: categoryName },
              ]}
              className="mb-8 text-white/80"
            />

            <div className="text-center">
              <AnimatedHeading className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                {categoryName} Events
              </AnimatedHeading>
              <AnimatedDivider className="w-24 h-1 bg-white mx-auto mb-8" />
              <p className="text-lg md:text-xl text-white/90 mb-4">
                Explore {categoryName.toLowerCase()} events, workshops, and activities
              </p>
              <div className="flex gap-6 justify-center text-white/80">
                <div>
                  <span className="text-2xl font-bold text-white">{sortedEvents.length}</span>
                  <p className="text-sm">Total Events</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">{upcomingCount}</span>
                  <p className="text-sm">Upcoming</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50" ref={ref}>
        <div className="container px-4 md:px-6">
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={categoryName}
            setSelectedCategory={() => { }}
            categories={[categoryName]}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOptions={[
              { value: "latest", label: "Latest" },
              { value: "popular", label: "Most Popular" },
              { value: "upcoming", label: "Upcoming First" },
              { value: "alphabetical", label: "A-Z" },
            ]}
          />

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonCard variant="event" count={6} />
            </div>
          )}

          {!loading && currentEvents.length > 0 && (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentEvents.map((event, index) => (
                  <EventCard key={event.event_uuid} event={event} index={index} />
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

          {!loading && sortedEvents.length === 0 && (
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No events found in {categoryName}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? `No events match your search "${searchQuery}"`
                    : `No events found in "${categoryName}" category`}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white"
                  >
                    Clear search
                  </Button>
                  <Link href="/events">
                    <Button className="bg-[#004987] hover:bg-[#003b6d]">
                      View all events
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section >
    </div >
  );
}