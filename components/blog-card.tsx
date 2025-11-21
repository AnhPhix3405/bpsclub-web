import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Share2, BookmarkPlus, Bookmark, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface BlogCardProps {
    blog: {
        blog_uuid: string;
        slug: string;
        title: string;
        short_description: string;
        thumbnail_url?: string;
        created_at: string;
        views: number;
        tags?: { id: number; name: string }[];
        content?: string;
    };
    index?: number;
}

function calculateReadingTime(content?: string): number {
    if (!content) return 5;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

export function BlogCard({ blog, index = 0 }: BlogCardProps) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const readingTime = calculateReadingTime(blog.content);

    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarkedBlogs") || "[]");
        setIsBookmarked(bookmarks.includes(blog.blog_uuid));
    }, [blog.blog_uuid]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarkedBlogs") || "[]");
        let newBookmarks;

        if (isBookmarked) {
            newBookmarks = bookmarks.filter((id: string) => id !== blog.blog_uuid);
            toast.success("Removed from bookmarks");
        } else {
            newBookmarks = [...bookmarks, blog.blog_uuid];
            toast.success("Added to bookmarks");
        }

        localStorage.setItem("bookmarkedBlogs", JSON.stringify(newBookmarks));
        setIsBookmarked(!isBookmarked);
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/blogs/${blog.slug}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog.title,
                    text: blog.short_description,
                    url: url,
                });
                toast.success("Shared successfully");
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    copyToClipboard(url);
                }
            }
        } else {
            copyToClipboard(url);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Link copied to clipboard");
    };

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

    const visibleTags = blog.tags?.slice(0, 3) || [];
    const remainingTagsCount = (blog.tags?.length || 0) - 3;

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col"
        >
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={blog.thumbnail_url || "/placeholder.jpg"}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-[#004987] mb-3 line-clamp-2 group-hover:text-[#0070b8] transition-colors duration-300">
                    {blog.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                    {blog.short_description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-[#004987]" />
                            <span className="font-medium">{new Date(blog.created_at).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-[#004987]" />
                            <span className="font-medium">{readingTime} min read</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-[#004987]" />
                        <span className="font-medium">{blog.views}</span>
                    </div>
                </div>

                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {visibleTags.map((tag) => (
                            <span
                                key={tag.id}
                                className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200"
                            >
                                {tag.name}
                            </span>
                        ))}
                        {remainingTagsCount > 0 && (
                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                +{remainingTagsCount} more
                            </span>
                        )}
                    </div>
                )}

                <div className="flex gap-2 mt-auto">
                    <Link href={`/blogs/${blog.slug}`} className="flex-1">
                        <Button
                            variant="outline"
                            className="w-full text-[#004987] border-2 border-[#004987] hover:bg-[#004987] hover:text-white transition-all duration-300 font-semibold"
                        >
                            Read More
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShare}
                        className="text-[#004987] border-2 border-[#004987] hover:bg-[#004987] hover:text-white transition-all duration-300"
                    >
                        <Share2 className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleBookmark}
                        className={`border-2 transition-all duration-300 ${isBookmarked
                                ? "bg-[#004987] text-white border-[#004987] hover:bg-[#003b6d]"
                                : "text-[#004987] border-[#004987] hover:bg-[#004987] hover:text-white"
                            }`}
                    >
                        {isBookmarked ? <Bookmark className="h-4 w-4 fill-current" /> : <BookmarkPlus className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
