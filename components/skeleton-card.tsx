import { motion } from "framer-motion";

interface SkeletonCardProps {
    variant?: "event" | "blog";
    count?: number;
}

export function SkeletonCard({ variant = "event", count = 3 }: SkeletonCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-lg overflow-hidden shadow-lg"
                >
                    <div className="relative h-48 bg-gray-200 animate-pulse">
                        <div className="absolute top-4 left-4 w-20 h-6 bg-gray-300 rounded-full" />
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
                        </div>

                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />

                        {variant === "blog" && (
                            <div className="flex gap-2">
                                <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
                                <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
                                <div className="h-6 bg-gray-200 rounded-full w-14 animate-pulse" />
                            </div>
                        )}

                        <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
                    </div>
                </motion.div>
            ))}
        </>
    );
}
