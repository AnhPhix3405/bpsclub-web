"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Eye, 
  Heart, 
  Edit, 
  Trash2, 
  Search, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin
} from "lucide-react";
import { useEvent } from "@/hooks/useEvent";
import Link from "next/link";

export default function AdminEventsPage() {
  // Use custom hook for event logic
  const {
    // Data
    events,
    categories,
    
    // Loading states
    loading,
    categoriesLoading,
    
    // Pagination
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    currentEvents,
    
    // Filters
    selectedCategory,
    searchQuery,
    sortBy,
    
    // Actions
    setCurrentPage,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    handleDelete,
  } = useEvent();

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric"
    });
  };

  // Format updated_at
  const formatUpdatedAt = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý sự kiện
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tất cả các sự kiện của câu lạc bộ
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Bộ lọc và tìm kiếm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm sự kiện..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Đang tải...
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at_DESC">Mới nhất</SelectItem>
                  <SelectItem value="created_at_ASC">Cũ nhất</SelectItem>
                  <SelectItem value="date_DESC">Ngày diễn ra (Mới → Cũ)</SelectItem>
                  <SelectItem value="date_ASC">Ngày diễn ra (Cũ → Mới)</SelectItem>
                  <SelectItem value="views_DESC">Lượt xem cao nhất</SelectItem>
                  <SelectItem value="likes_DESC">Lượt thích cao nhất</SelectItem>
                </SelectContent>
              </Select>

              {/* Create Button */}
              <Button className="bg-[#004987] hover:bg-[#003366]">
                <Plus className="w-4 h-4 mr-2" />
                Tạo sự kiện mới
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Danh sách sự kiện ({events.length})</span>
              {events.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  Trang {currentPage} / {totalPages}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              // Loading state
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentEvents.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không có sự kiện nào
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || (selectedCategory && selectedCategory !== "all")
                    ? "Không tìm thấy sự kiện nào phù hợp với bộ lọc của bạn."
                    : "Chưa có sự kiện nào được tạo. Hãy tạo sự kiện đầu tiên!"
                  }
                </p>
                <Button className="bg-[#004987] hover:bg-[#003366]">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo sự kiện đầu tiên
                </Button>
              </div>
            ) : (
              // Events list
              <div className="space-y-4">
                {currentEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-start justify-between">
                      {/* Event Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Event Image/Icon */}
                          <div className="w-16 h-16 bg-[#004987] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-8 h-8 text-white" />
                          </div>
                          
                          {/* Event Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                              {event.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span className="truncate max-w-32">{event.location}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-1 text-blue-600">
                                <Eye className="w-4 h-4" />
                                <span>{event.views}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 text-red-600">
                                <Heart className="w-4 h-4" />
                                <span>{event.likes}</span>
                              </div>
                              
                              <div className="text-gray-500">
                                Cập nhật: {formatUpdatedAt(event.updated_at)}
                              </div>
                              
                              {event.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {event.category.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          asChild
                        >
                          <Link href={`/events/${event.id}`} target="_blank">
                            <Eye className="w-4 h-4 mr-1" />
                            Xem
                          </Link>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-yellow-600 hover:text-yellow-700"
                          asChild
                        >
                          <Link href={`/admin/events/${event.id}`}>
                            <Edit className="w-4 h-4 mr-1" />
                            Sửa
                          </Link>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(event.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && events.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="text-sm text-gray-700">
                  Hiển thị {startIndex + 1} - {Math.min(endIndex, events.length)} của {events.length} sự kiện
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      const isCurrentPage = pageNumber === currentPage;
                      
                      // Show page numbers around current page
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={pageNumber}
                            variant={isCurrentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                            className={isCurrentPage ? "bg-[#004987] hover:bg-[#003366]" : ""}
                          >
                            {pageNumber}
                          </Button>
                        );
                      }
                      
                      // Show ellipsis
                      if (pageNumber === 2 && currentPage > 4) {
                        return <span key="ellipsis1" className="px-2">...</span>;
                      }
                      if (pageNumber === totalPages - 1 && currentPage < totalPages - 3) {
                        return <span key="ellipsis2" className="px-2">...</span>;
                      }
                      
                      return null;
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
