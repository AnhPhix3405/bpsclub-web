"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { List } from "lucide-react";

interface Heading {
    id: string;
    text: string;
    level: number;
}

interface TableOfContentsProps {
    content: string;
    className?: string;
}

export function TableOfContents({ content, className = "" }: TableOfContentsProps) {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
        const extractHeadings = () => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;

            const headingElements = tempDiv.querySelectorAll("h1, h2, h3, h4");
            const extractedHeadings: Heading[] = [];

            headingElements.forEach((heading, index) => {
                const id = heading.id || `heading-${index}`;
                heading.id = id;

                extractedHeadings.push({
                    id,
                    text: heading.textContent || "",
                    level: parseInt(heading.tagName.substring(1)),
                });
            });

            setHeadings(extractedHeadings);
        };

        if (content) {
            extractHeadings();
        }
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -80% 0px" }
        );

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offset,
                behavior: "smooth",
            });
        }
    };

    if (headings.length === 0) return null;

    return (
        <div className={`bg-gray-50 rounded-lg p-6 sticky top-24 ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full mb-4"
            >
                <h3 className="text-lg font-semibold text-[#004987] flex items-center gap-2">
                    <List className="w-5 h-5" />
                    Table of Contents
                </h3>
                <motion.div
                    animate={{ rotate: isOpen ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </motion.div>
            </button>

            <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
            >
                <nav className="space-y-2">
                    {headings.map((heading) => (
                        <button
                            key={heading.id}
                            onClick={() => scrollToHeading(heading.id)}
                            className={`block w-full text-left text-sm transition-colors duration-200 ${activeId === heading.id
                                    ? "text-[#004987] font-semibold"
                                    : "text-gray-600 hover:text-[#004987]"
                                }`}
                            style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                        >
                            {heading.text}
                        </button>
                    ))}
                </nav>
            </motion.div>
        </div>
    );
}
