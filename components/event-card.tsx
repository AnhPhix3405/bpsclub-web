import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
    event: {
        event_uuid: string;
        slug: string;
        title: string;
        excerpt?: string;
        image?: string;
        date?: string;
        time?: string;
        location?: string;
        views?: number;
        category?: {
            name: string;
        };
        status?: string;
        participants?: number;
    };
    index?: number;
    onCategoryClick?: (category: string) => void;
}

function formatDate(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
}

function formatTime(timeString?: string) {
    if (!timeString || timeString === "00:00") return "";
    return timeString.slice(0, 5);
}

function getStatusBadge(status?: string, date?: string) {
    if (!status && date) {
        const eventDate = new Date(date);
        const now = new Date();
        if (eventDate > now) return { label: "Upcoming", color: "bg-green-500" };
        if (eventDate.toDateString() === now.toDateString()) return { label: "Today", color: "bg-orange-500" };
        return { label: "Past", color: "bg-gray-400" };
    }

    const statusMap = {
        upcoming: { label: "Upcoming", color: "bg-green-500" },
        ongoing: { label: "Ongoing", color: "bg-orange-500" },
        completed: { label: "Completed", color: "bg-gray-400" },
    };

    return statusMap[status as keyof typeof statusMap] || { label: "Event", color: "bg-blue-500" };
}

export function EventCard({ event, index = 0, onCategoryClick }: EventCardProps) {
    const statusBadge = getStatusBadge(event.status, event.date);

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
            },
        },
    };

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
        >
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={
                        !event.image
                            ? "/placeholder.svg"
                            : event.image.startsWith("http") || event.image.startsWith("/")
                                ? event.image
                                : "/" + event.image
                    }
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-4 left-4 flex gap-2">
                    {event.category?.name && (
                        <Link
                            href={`/events/categories/${encodeURIComponent(event.category.name.toLowerCase())}`}
                            onClick={(e) => {
                                if (onCategoryClick) {
                                    e.preventDefault();
                                    onCategoryClick(event.category!.name);
                                }
                            }}
                        >
                            <span className="px-3 py-1 text-xs font-semibold bg-[#004987] text-white rounded-full hover:bg-[#003b6d] transition-all duration-300 cursor-pointer shadow-lg backdrop-blur-sm">
                                {event.category.name}
                            </span>
                        </Link>
                    )}
                </div>

                <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-semibold ${statusBadge.color} text-white rounded-full shadow-lg backdrop-blur-sm`}>
                        {statusBadge.label}
                    </span>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3 gap-4 flex-wrap">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-[#004987]" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                    </div>
                    {formatTime(event.time) && (
                        <>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-[#004987]" />
                                <span className="font-medium">{formatTime(event.time)}</span>
                            </div>
                        </>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-3 text-[#004987] line-clamp-2 group-hover:text-[#0070b8] transition-colors duration-300">
                    {event.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {event.excerpt ?? ""}
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-[#004987]" />
                        <span className="line-clamp-1">{event.location ?? ""}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2 text-[#004987]" />
                            <span>{event.views || 0} views</span>
                        </div>

                        {event.participants && (
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-[#004987]" />
                                <span>{event.participants} participants</span>
                            </div>
                        )}
                    </div>
                </div>

                <Link href={`/events/${event.slug}`}>
                    <Button
                        variant="outline"
                        className="w-full text-[#004987] border-2 border-[#004987] hover:bg-[#004987] hover:text-white transition-all duration-300 font-semibold group-hover:shadow-lg"
                    >
                        View Details
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}
