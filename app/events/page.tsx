"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  AnimatedSection,
  AnimatedHeading,
  AnimatedDivider,
} from "@/components/ui/animated-section";
import { useEvent } from "@/hooks/useEvent";
import { FilterBar } from "@/components/filter-bar";
import { EventCard } from "@/components/event-card";
import { SkeletonCard } from "@/components/skeleton-card";

export default function EventsPage() {
  const router = useRouter();

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

  const [sortBy, setSortBy] = useState("latest");

  const categoryOptions = [
    "all",
    ...categories.map(cat => cat.name)
  ];

  const handleCategoryClick = (category: string) => {
    if (category === "all") {
      setSelectedCategory(category);
    } else {
      category = category.toLowerCase();
      router.push(`/events/categories/${encodeURIComponent(category)}`);
    }
  };

  const sortedEvents = [...eventData].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date || "").getTime() - new Date(a.date || "").getTime();
    } else if (sortBy === "popular") {
      return (b.views || 0) - (a.views || 0);
    } else if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
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

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SkeletonCard variant="event" count={6} />
            </div>
          )}

          {!isLoading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {sortedEvents.map((event, index) => (
                <EventCard
                  key={event.event_uuid}
                  event={event}
                  index={index}
                  onCategoryClick={handleCategoryClick}
                />
              ))}
            </motion.div>
          )}

          {!isLoading && eventData.length === 0 && (
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
                  No events found
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
