"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Search,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import short from "short-uuid";
import {
  AnimatedSection,
  AnimatedHeading,
  AnimatedDivider,
} from "@/components/ui/animated-section";

// Import useEvent hook
import { useEvent } from "@/hooks/useEvent";

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

export default function EventsPage() {
  const router = useRouter();
  
  // Use the centralized useEvent hook
  const {
    events: eventData,
    categories,
    loading: isLoading,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
  } = useEvent();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Convert categories to include "all" option
  const categoryOptions = [
    "all", 
    ...categories.map(cat => cat.name)
  ];

  // Handle category click
  const handleCategoryClick = (category: string) => {
    if (category === "all") {
      // Stay on current page but reset filter
      setSelectedCategory(category);
    } else {
      category = category.toLowerCase();
      router.push(`/events/categories/${encodeURIComponent(category)}`);
    }
  };

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
            <AnimatedHeading className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Blockchain Pioneer Student Events
            </AnimatedHeading>
            <AnimatedDivider className="w-24 h-1 bg-white mx-auto mb-8" />
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Explore events, workshops, and hackathons about Blockchain and
              Web3
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 md:py-24 bg-gray-50" ref={ref}>
        <div className="container px-4 md:px-6">
          {/* Filters */}
          <motion.div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
              {/* Search */}
              <motion.div
                className="relative w-full md:w-96"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004987] focus:border-transparent transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </motion.div>

              {/* Category Filter */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {categoryOptions.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    onClick={() => handleCategoryClick(category)}
                    className="transition-all duration-300 hover:scale-105"
                  >
                    {category === "all" ? "All categories" : category}
                  </Button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#004987] border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading events...</p>
            </div>
          )}

          {/* Events Grid */}
          {!isLoading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {eventData.map((event) => (
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
                      <Link href={`/events/categories/${encodeURIComponent(event.category?.name || 'uncategorized')}`}>
                        <span className="px-3 py-1 text-xs font-medium bg-[#004987] text-white rounded-full hover:bg-[#003b6d] transition-colors duration-300 cursor-pointer">
                          {event.category?.name || 'Uncategorized'}
                        </span>
                      </Link>
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
                      <span>{event.views || 0} views</span>
                    </div>
                    <Link
                      href={`/events/${event.slug}-${short().fromUUID(
                        event.event_uuid
                      )}`}
                    >
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
          {!isLoading && eventData.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">
                No events match your search criteria.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#004987] to-[#0070b8] text-white">
        <div className="container px-4 md:px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <AnimatedHeading className="text-2xl md:text-3xl font-bold mb-4">
              Want to organize an event with us?
            </AnimatedHeading>
            <p className="text-lg mb-8 text-white/90">
              Contact us to collaborate on Blockchain and Web3 events
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Contact us
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/partners">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Learn more
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
