"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
    targetDate: string;
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownTimer({ targetDate, className = "" }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate).getTime() - new Date().getTime();

            if (difference <= 0) {
                setIsExpired(true);
                return null;
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (isExpired) {
        return (
            <div className={`text-center ${className}`}>
                <p className="text-lg font-semibold text-gray-600">Event has started!</p>
            </div>
        );
    }

    if (!timeLeft) return null;

    const timeUnits = [
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
    ];

    return (
        <div className={`flex gap-4 justify-center ${className}`}>
            {timeUnits.map((unit, index) => (
                <motion.div
                    key={unit.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center"
                >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[70px] border border-white/20">
                        <div className="text-3xl md:text-4xl font-bold text-white">
                            {String(unit.value).padStart(2, "0")}
                        </div>
                    </div>
                    <div className="text-xs md:text-sm text-white/80 mt-2 font-medium">
                        {unit.label}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
