"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ReadingProgressProps {
    target?: string;
    className?: string;
}

export function ReadingProgress({ target = "body", className = "" }: ReadingProgressProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const element = document.querySelector(target);
            if (!element) return;

            const totalHeight = element.scrollHeight - window.innerHeight;
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setProgress(Math.min(100, Math.max(0, currentProgress)));
        };

        window.addEventListener("scroll", updateProgress);
        updateProgress();

        return () => window.removeEventListener("scroll", updateProgress);
    }, [target]);

    return (
        <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
            <motion.div
                className="h-1 bg-gradient-to-r from-[#004987] to-[#0070b8]"
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
            />
        </div>
    );
}
