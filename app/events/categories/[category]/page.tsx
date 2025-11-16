"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  Search,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  AnimatedSection,
  AnimatedHeading,
  AnimatedDivider,
} from "@/components/ui/animated-section";
import { eventService, Event } from "@/lib/services/eventService";

// Helper: format date as dd/MM/yyyy
function formatDate(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

// Helper: format time as HH:mm
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

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch events for this category
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

  // Filter events based on search
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-[#004987] to-[#0070b8] text-white overflow-hidden">
        {/* Animated background elements */}
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
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            {/* Back button */}
            <div className="flex justify-start mb-6">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </div>
            
            <AnimatedHeading className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {categoryName} Events
            </AnimatedHeading>
            <AnimatedDivider className="w-24 h-1 bg-white mx-auto mb-8" />
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Explore {categoryName.toLowerCase()} events, workshops, and activities
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 md:py-24 bg-gray-50" ref={ref}>
        <div className="container px-4 md:px-6">
          {/* Search */}
          <motion.div className="mb-12">
            <div className="flex justify-center">
              <motion.div
                className="relative w-full md:w-96"
                initial={{ opacity: 0, y: -20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <input
                  type="text"
                  placeholder="Search in this category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004987] focus:border-transparent transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#004987] border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading {categoryName.toLowerCase()} events...</p>
            </div>
          )}

          {/* Events Grid */}
          {!loading && filteredEvents.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
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
                    {event.location && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{event.views || 0} views</span>
                    </div>
                    <Link href={`/events/${event.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white transition-colors duration-300"
                      >
                        View details
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Results Message */}
          {!loading && filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="max-w-md mx-auto">
                <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery ? 
                    `No events in "${categoryName}" match your search "${searchQuery}".` :
                    `No events found in "${categoryName}" category.`
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </section>
    </div>
  );
}