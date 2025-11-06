"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  Award,
  Handshake,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimatedDivider } from "@/components/ui/animated-section";
import { PartnerType, PartnerStatus } from "@/app/api/partners/types";
import { PartnersService } from "@/app/api/partners/partners.service";
import { toast } from "react-hot-toast";

// Constants for page content
const PAGE_CONTENT = {
  hero: {
    title: "Partners & Sponsors",
    description:
      "Together with strategic partners, we build a strong Blockchain community",
  },
  filters: {
    searchPlaceholder: "Search partners...",
    typeOptions: [
      "all",
      "academic",
      "business",
      "community",
      "government",
      "technology",
    ],
    typeLabels: {
      all: "All",
      academic: "Academic",
      business: "Business",
      community: "Community",
      government: "Government",
      technology: "Technology",
    },
  },
  status: {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
  },
  cta: {
    title: "Become our partner",
    description:
      "Let's build a strong and sustainable Blockchain community together",
    buttonText: "Contact us",
  },
  errors: {
    loading: "Unable to load partners list",
    adding: "Unable to add new partner",
    updating: "Unable to update partner",
    deleting: "Unable to delete partner",
    network: "Network error",
    unknown: "An unknown error occurred",
    noResults: "No matching partners found",
  },
};

// Thêm interface cho partner với arrays
interface PartnerWithArrays {
  id: number;
  name: string;
  logo: string;
  type: PartnerType;
  description: string;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  achievements: string[];
  collaboration: string[];
  status: PartnerStatus;
  created_at: string;
  updated_at: string;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<PartnerWithArrays[]>([]);
  const [selectedPartner, setSelectedPartner] =
    useState<PartnerWithArrays | null>(null);
  const [selectedType, setSelectedType] = useState<PartnerType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch partners khi component mount hoặc khi filter thay đổi
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await PartnersService.filterPartners(
          selectedType,
          searchQuery
        );
        setPartners(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : PAGE_CONTENT.errors.loading;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartners();
  }, [selectedType, searchQuery]);

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
        <div className="container relative z-10 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {PAGE_CONTENT.hero.title}
            </motion.h1>
            <AnimatedDivider className="w-24 h-1 bg-white mx-auto mb-8" />

            <motion.p
              className="text-lg md:text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {PAGE_CONTENT.hero.description}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 md:py-24 bg-gray-50" ref={ref}>
        <div className="container px-4 md:px-6">
          {/* Filters and Search */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
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
                  placeholder={PAGE_CONTENT.filters.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004987] focus:border-transparent transition-all duration-300"
                />
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </motion.div>

              {/* Type Filter */}
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {PAGE_CONTENT.filters.typeOptions.map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? "default" : "outline"}
                    onClick={() => setSelectedType(type as PartnerType | "all")}
                    className="transition-all duration-300"
                  >
                    {
                      PAGE_CONTENT.filters.typeLabels[
                        type as keyof typeof PAGE_CONTENT.filters.typeLabels
                      ]
                    }
                  </Button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004987] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading partners...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Partners Grid */}
          {!isLoading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {partners.map((partner) => (
                <motion.div
                  key={partner.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Partner Card Content */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden group">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-[#004987] text-white rounded-full">
                        {partner.type}
                      </span>
                      {partner.status === "active" && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {PAGE_CONTENT.status.active}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-[#004987] mb-2">
                      {partner.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {partner.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {partner.collaboration.slice(0, 2).map((item, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        className="text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white transition-colors duration-300"
                        onClick={() => setSelectedPartner(partner)}
                      >
                        View details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                      <Link
                        href={partner.website || "#"}
                        target="_blank"
                        className={
                          !partner.website
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-[#004987] transition-colors duration-300"
                          disabled={!partner.website}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* No Results Message */}
          {!isLoading && !error && partners.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-600 text-lg">
                {PAGE_CONTENT.errors.noResults}
              </p>
            </motion.div>
          )}

          {/* Become Partner CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 bg-gradient-to-r from-[#004987] to-[#0070b8] rounded-2xl p-8 md:p-12 text-white"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {PAGE_CONTENT.cta.title}
              </h2>
              <p className="text-lg text-white/90 mb-8">
                {PAGE_CONTENT.cta.description}
              </p>
              <Button
                size="lg"
                className="bg-white text-[#004987] hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                {PAGE_CONTENT.cta.buttonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Detail Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPartner(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              <div className="relative">
                <div className="h-48 bg-gray-100 relative">
                  <Image
                    src={selectedPartner.logo}
                    alt={selectedPartner.name}
                    fill
                    className="object-contain p-6"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white transition-colors duration-300"
                  onClick={() => setSelectedPartner(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 text-sm font-medium bg-[#004987] text-white rounded-full">
                    {selectedPartner.type}
                  </span>
                  {selectedPartner.status === "active" && (
                    <span className="px-2 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
                      {PAGE_CONTENT.status.active}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-semibold text-[#004987] mb-4">
                  {selectedPartner.name}
                </h3>

                <p className="text-gray-600 mb-6">
                  {selectedPartner.description}
                </p>

                {/* Achievements and Collaboration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-lg font-semibold text-[#004987] mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Key achievements
                    </h4>
                    {selectedPartner.achievements &&
                    selectedPartner.achievements.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPartner.achievements.map(
                          (achievement, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {achievement}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No notable achievements.
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-[#004987] mb-3 flex items-center gap-2">
                      <Handshake className="w-5 h-5" />
                      Collaboration
                    </h4>
                    {selectedPartner.collaboration &&
                    selectedPartner.collaboration.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedPartner.collaboration.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No collaboration information.
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="w-4 h-4 text-[#004987] flex-shrink-0" />
                    <Link
                      href={selectedPartner.website || "#"}
                      target="_blank"
                      className={
                        !selectedPartner.website
                          ? "pointer-events-none opacity-50 truncate"
                          : "hover:text-[#004987] transition-colors duration-300 truncate"
                      }
                    >
                      {selectedPartner.website || "N/A"}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-[#004987] flex-shrink-0" />
                    <a
                      href={`mailto:${selectedPartner.email}`}
                      className={
                        !selectedPartner.email
                          ? "pointer-events-none opacity-50 truncate"
                          : "hover:text-[#004987] transition-colors duration-300 truncate"
                      }
                    >
                      {selectedPartner.email || "N/A"}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-[#004987] flex-shrink-0" />
                    <a
                      href={`tel:${selectedPartner.phone}`}
                      className={
                        !selectedPartner.phone
                          ? "pointer-events-none opacity-50 truncate"
                          : "hover:text-[#004987] transition-colors duration-300 truncate"
                      }
                    >
                      {selectedPartner.phone || "N/A"}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-[#004987] flex-shrink-0 mt-1" />
                  <span>{selectedPartner.address || "N/A"}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
