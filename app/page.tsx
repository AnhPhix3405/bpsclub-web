"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Calendar,
  BookOpen,
  Users,
  Award,
  LucideIcon,
  ExternalLink,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState, useMemo } from "react";
import type { Event } from "@/lib/services/eventService";
import type { Partner } from "@/lib/services/partnerService";
import { eventService } from "@/lib/services/eventService";
import { partnerService } from "@/lib/services/partnerService";
import JoinPopup from "@/components/join-popup";
import { ParticlesBackground } from "@/components/particles-background";

// Define types for data structures
interface IntroFeature {
  icon: LucideIcon;
  title: string;  
  description: string;
}

// Add SectionAnimation component
const SectionAnimation = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

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

export default function Home() {
  const [introRef, introInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [activitiesRef, activitiesInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // State for featured events
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [partners, setPartners] = useState<Partner[]>([]);
  const partnersToShow = useMemo(() => partners.slice(0, 24), [partners]);
  // Build a repeated list so marquee loops seamlessly even with few logos
  const marqueeItems = useMemo(() => {
    const base = partnersToShow.length > 0 ? partnersToShow : [];
    const minItems = 12;
    const targetLength = Math.max(minItems, base.length * 2);
    const repeated: Partner[] = [];
    for (let i = 0; i < targetLength; i++) {
      repeated.push(
        base[i % (base.length || 1)] || {
          // Fallback in case base is empty
          id: -1,
          name: "",
          logo: "/placeholder.svg",
          type: "business" as const,
          description: "",
          website: "",
          email: "",
          phone: "",
          address: "",
          status: "active" as const,
          created_at: "",
          updated_at: "",
        }
      );
    }
    return repeated;
  }, [partnersToShow]);

  // Category list
  const categories = ["all", "Workshop", "Hackathon", "Seminar", "Community"];

  useEffect(() => {
    // Fetch top 3 events by views from API using eventService
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const data = await eventService.getAllEvents({
          sort: 'views_desc',
          limit: 3
        });
        setFeaturedEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorEvents("Unable to load latest events");
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch partners logos for marquee using partnerService
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await partnerService.getAllPartners();
        setPartners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners([]);
      }
    };
    fetchPartners();
  }, []);

  // Filter events by category (for child cards)
  const getSubEvents = (parentEvent: Event) => {
    let filtered = featuredEvents.filter((e) => e.id !== parentEvent.id);
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (e) => e.category === parentEvent.category && e.id !== parentEvent.id
      );
    }
    // If less than 3, take from others (excluding current)
    if (filtered.length < 3) {
      const others = featuredEvents.filter(
        (e) => e.id !== parentEvent.id && !filtered.includes(e)
      );
      filtered = filtered.concat(others).slice(0, 3);
    } else {
      filtered = filtered.slice(0, 3);
    }
    return filtered;
  };

  // Data for Quick Introduction features
  const introFeatures: IntroFeature[] = [
    {
      icon: BookOpen,
      title: "Learning",
      description:
        "Workshops, seminars, and courses from fundamentals to advanced Blockchain & Web3.",
    },
    {
      icon: Users,
      title: "Community",
      description:
        "Connect with students, experts, and companies in the Blockchain space.",
    },
    {
      icon: Award,
      title: "Hands-on",
      description:
        "Join real-world projects, hackathons, and internship opportunities at top tech firms.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <ParticlesBackground />
      {/* Hero Banner */}
      <section className="w-full bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center py-12 md:py-24">
            <div className="space-y-4 text-center lg:text-left">
              <p className="text-sm font-semibold tracking-widest uppercase text-[#004987]">
                Vietnam&apos;s pioneering Web3 student community
              </p>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-[#002b52]">
                Blockchain Pioneer Student
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 mx-auto lg:mx-0">
                Discover, learn, and grow with the Blockchain community at the
                University of Transport and Communications.
              </p>
              <Link href="/join">
                <Button
                  size="lg"
                  className="bg-[#004987] text-white hover:bg-[#003b6d] shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg mt-3"
                >
                  Join the club
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Image
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height={550}
              src="/a8fd3637dcec6fb236fd.jpg"
              width={550}
              priority
            />
          </div>
        </div>
      </section>

      {/* Quick Introduction */}
      <section className="py-12 md:py-16 bg-gray-50" ref={introRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={introInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#004987] mb-4">
              About Blockchain Pioneer Student Club
            </h2>
            <motion.div
              className="w-20 h-1 bg-[#004987] mx-auto mb-6"
              initial={{ width: 0 }}
              animate={introInView ? { width: 80 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <p className="max-w-3xl mx-auto text-gray-600 text-sm md:text-base">
              The club brings together students passionate about Blockchain and
              Web3, creating an environment for learning, research, and hands-on
              practice with future-shaping technologies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {introFeatures.map((item, index) => (
              <motion.div
                key={index}
                className="relative bg-gray-50 p-6 rounded-lg text-center border border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(0,73,135,0.35)] hover:border-[#004987] hover:ring-2 hover:ring-[#2b74aa]/50"
                initial={{ opacity: 0, y: 20 }}
                animate={introInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 * index }}
              >
                <div className="w-16 h-16 bg-[#004987]/10 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 hover:scale-110">
                  <item.icon className="h-8 w-8 text-[#004987]" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#004987]">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-12 md:py-16 bg-gray-50" ref={activitiesRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={activitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#004987] mb-4">
              Featured activities
            </h2>
            <motion.div
              className="w-20 h-1 bg-[#004987] mx-auto mb-6"
              initial={{ width: 0 }}
              animate={activitiesInView ? { width: 80 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          {/* Loading state */}
          {loadingEvents && (
            <div className="text-center py-8 text-gray-500">
              Loading events...
            </div>
          )}
          {/* Error state */}
          {errorEvents && (
            <div className="text-center py-8 text-red-500">{errorEvents}</div>
          )}
          {/* Events grid */}
          {!loadingEvents && !errorEvents && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredEvents
                .filter(
                  (ev) =>
                    selectedCategory === "all" ||
                    ev.category?.name === selectedCategory
                )
                .map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={activitiesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                  >
                    <div className="relative h-48 overflow-hidden group">
                      <Image
                        src={
                          !activity.image
                            ? "/placeholder.svg"
                            : activity.image.startsWith("http") ||
                              activity.image.startsWith("/")
                            ? activity.image
                            : "/" + activity.image
                        }
                        alt={activity.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-xs font-medium bg-[rgb(0,73,135)] text-white rounded-full">
                          {activity.category?.name}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      {/* Date and Time Row */}
                      <div className="flex items-center text-sm text-gray-500 mb-2 gap-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(activity.date)}</span>
                        </div>
                        {formatTime(activity.time) && (
                          <>
                            <span className="mx-1 text-gray-400">|</span>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{formatTime(activity.time)}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-[#004987] line-clamp-2">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-3">
                        {activity.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span>{activity.views || 0} views</span>
                      </div>
                      <Link
                        href={`/events/${activity.event_uuid || activity.id}`}
                        onClick={async (e) => {
                          // Fire-and-forget increment, don't block navigation
                          try {
                            const viewsEndpoint = activity.event_uuid 
                              ? `/api/events/uuid/${activity.event_uuid}/views`
                              : `/api/events/${activity.id}/views`;
                            
                            navigator.sendBeacon?.(
                              viewsEndpoint,
                              new Blob([], { type: "application/json" })
                            ) ||
                              fetch(viewsEndpoint, {
                                method: "POST",
                                keepalive: true,
                              }).catch(() => {});
                          } catch {}
                        }}
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
            </div>
          )}

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={activitiesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/events">
              <Button
                variant="outline"
                className="text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white transition-all duration-300 hover:scale-105"
              >
                View all events
                <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <SectionAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#004987] mb-4">
                Partners & Sponsors
              </h2>
              <div className="w-20 h-1 bg-[#004987] mx-auto mb-6"></div>
            </div>
          </SectionAnimation>

          {partners.length > 0 && (
            <div
              className="overflow-hidden relative"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              }}
            >
              <div
                className="flex animate-marquee-continuous"
                style={{
                  willChange: "transform",
                  width: "max-content",
                  whiteSpace: "nowrap",
                }}
              >
                {[...marqueeItems, ...marqueeItems].map((p, index) => (
                  <div
                    key={`marqueeC-${p.id}-${index}`}
                    className="flex items-center justify-center p-2 mx-2 w-[140px] transition-transform duration-300 hover:scale-110 hover:shadow-xl"
                  >
                    <Image
                      src={
                        p.logo?.startsWith("http") || p.logo?.startsWith("/")
                          ? p.logo
                          : "/" + p.logo
                      }
                      alt={p.name}
                      width={140} 
                      height={60}
                      className="object-contain transition-all"
                      sizes="140px"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <SectionAnimation delay={0.1}>
            <div className="text-center mt-10">
              <Link href="#">
                <Button
                  variant="link"
                  className="text-[#004987] hover:scale-105 transition-transform duration-300"
                >
                  View all partners
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </SectionAnimation>
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-12 md:py-16 bg-gradient-to-r from-[#004987] to-[#0070b8] text-white"
        ref={ctaRef}
      >
        <div className="container px-4 md:px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to join us?
            </h2>
            <p className="text-base md:text-lg mb-8 text-white/80">
              Sign up today to become a member of the Blockchain Pioneer Student
              Club and start your journey exploring breakthrough technology!
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/join">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Join the club
                </Button>
              </Link>
              <JoinPopup />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
