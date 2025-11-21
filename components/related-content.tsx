import { motion } from "framer-motion";
import { BlogCard } from "./blog-card";
import { EventCard } from "./event-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface RelatedContentProps {
    items: any[];
    type: "blog" | "event";
    title?: string;
    className?: string;
}

export function RelatedContent({
    items,
    type,
    title = "Related Content",
    className = "",
}: RelatedContentProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsPerPage = 3;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    if (items.length === 0) return null;

    const visibleItems = items.slice(
        currentIndex * itemsPerPage,
        (currentIndex + 1) * itemsPerPage
    );

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    };

    return (
        <div className={`${className}`}>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#004987]">{title}</h2>

                {totalPages > 1 && (
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrev}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleItems.map((item, index) => (
                    <motion.div
                        key={type === "blog" ? item.blog_uuid : item.event_uuid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        {type === "blog" ? (
                            <BlogCard blog={item} index={index} />
                        ) : (
                            <EventCard event={item} index={index} />
                        )}
                    </motion.div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-[#004987] w-8"
                                    : "bg-gray-300 hover:bg-gray-400"
                                }`}
                            aria-label={`Go to page ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
