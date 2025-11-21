import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface ScheduleItem {
    time: string;
    date: string;
    title: string;
    description: string;
}

interface EventTimelineProps {
    schedules: ScheduleItem[];
    className?: string;
}

export function EventTimeline({ schedules, className = "" }: EventTimelineProps) {
    if (!schedules || schedules.length === 0) return null;

    return (
        <div className={`relative ${className}`}>
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#004987] to-[#0070b8]" />

            <div className="space-y-8">
                {schedules.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-20"
                    >
                        <div className="absolute left-0 top-0 flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-[#004987] shadow-lg">
                            <Clock className="w-6 h-6 text-[#004987]" />
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 border-[#004987]">
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-lg font-bold text-[#004987]">{item.time}</span>
                                <span className="text-sm text-gray-500">{item.date}</span>
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {item.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
