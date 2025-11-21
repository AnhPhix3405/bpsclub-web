import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FilterBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    categories: string[];
    sortBy?: string;
    setSortBy?: (sort: string) => void;
    sortOptions?: { value: string; label: string }[];
    onCategoryClick?: (category: string) => void;
}

export function FilterBar({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    sortBy,
    setSortBy,
    sortOptions = [
        { value: "latest", label: "Latest" },
        { value: "popular", label: "Most Popular" },
        { value: "alphabetical", label: "A-Z" },
    ],
    onCategoryClick,
}: FilterBarProps) {
    const handleCategoryClick = (category: string) => {
        if (onCategoryClick) {
            onCategoryClick(category);
        } else {
            setSelectedCategory(category);
        }
    };

    const hasActiveFilters = searchQuery || selectedCategory !== "all";

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory("all");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 space-y-6"
        >
            <div className="glass-card p-6 rounded-xl">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                    <div className="relative w-full lg:w-96">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004987] focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {setSortBy && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004987] focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm cursor-pointer"
                            >
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            onClick={() => handleCategoryClick(category)}
                            className={`transition-all duration-300 hover:scale-105 ${selectedCategory === category
                                    ? "bg-[#004987] text-white hover:bg-[#003b6d] shadow-lg"
                                    : "bg-white/80 backdrop-blur-sm hover:bg-gray-100"
                                }`}
                        >
                            {category === "all" ? "All" : category}
                        </Button>
                    ))}
                </div>

                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 flex items-center gap-2"
                    >
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {searchQuery && (
                            <span className="px-3 py-1 bg-[#004987]/10 text-[#004987] rounded-full text-sm flex items-center gap-1">
                                Search: &quot;{searchQuery}&quot;
                            </span>
                        )}
                        {selectedCategory !== "all" && (
                            <span className="px-3 py-1 bg-[#004987]/10 text-[#004987] rounded-full text-sm">
                                {selectedCategory}
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-[#004987] transition-colors ml-2 flex items-center gap-1"
                        >
                            <X className="w-3 h-3" />
                            Clear all
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
