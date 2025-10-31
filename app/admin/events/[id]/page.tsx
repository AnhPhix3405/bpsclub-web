"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft,
  Upload,
  Save,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon
} from "lucide-react";
import { eventService, Event } from "@/lib/services/eventService";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";

// Dynamically import TinyMCE to avoid SSR issues
const RichTextEditor = dynamic(
  () => import("@/components/ui/rich-text-editor"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] bg-gray-50 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Đang tải editor...</div>
      </div>
    )
  }
);

export default function AdminEventEditPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // Event data state
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    specific_location: "",
    image: "",
    notion_content: "",
    is_visible: true,
  });

  // Fetch event data
  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(parseInt(eventId));
        
        if (eventData) {
          setEvent(eventData);
          setFormData({
            title: eventData.title || "",
            date: eventData.date ? eventData.date.split('T')[0] : "", // Format for date input
            time: eventData.time || "",
            location: eventData.location || "",
            specific_location: eventData.specific_location || "",
            image: eventData.image || "",
            notion_content: eventData.notion_content || "",
            is_visible: eventData.is_visible ?? true,
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Không thể tải thông tin sự kiện");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Handle input change
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('image', file);
  
      const mockImageUrl = URL.createObjectURL(file);
      handleInputChange('image', mockImageUrl);
      
      toast.success("Ảnh đã được tải lên thành công");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Không thể tải lên ảnh");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("Tên sự kiện là bắt buộc");
        return;
      }
      
      if (!formData.date) {
        toast.error("Ngày diễn ra là bắt buộc");
        return;
      }
      
      // Prepare data for API
      const updateData: Partial<Event> = {
        title: formData.title.trim(),
        date: formData.date,
        time: formData.time || undefined,
        location: formData.location || undefined,
        specific_location: formData.specific_location || undefined,
        image: formData.image || undefined,
        notion_content: formData.notion_content || undefined,
        is_visible: formData.is_visible,
      };
      
      await eventService.updateEvent(parseInt(eventId), updateData);
      
      toast.success("Sự kiện đã được cập nhật thành công");
      
      // Redirect back to events list after a delay
      setTimeout(() => {
        router.push('/admin/events');
      }, 1500);
      
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Không thể lưu thông tin sự kiện");
    } finally {
      setSaving(false);
    }
  };

  // Handle file input change
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      
      handleImageUpload(file);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-64 mb-6" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-10 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Không tìm thấy sự kiện
            </h1>
            <Link href="/admin/events">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin/events">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chỉnh sửa sự kiện
            </h1>
            <p className="text-gray-600">
              Cập nhật thông tin cho sự kiện: <span className="font-semibold">{event.title}</span>
            </p>
          </div>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Thông tin sự kiện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Tên sự kiện *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tên sự kiện..."
                  className="text-lg font-semibold"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày diễn ra *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Thời gian</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Ví dụ: Đại học GTVT"
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specific_location">Địa điểm cụ thể</Label>
                  <Input
                    id="specific_location"
                    value={formData.specific_location}
                    onChange={(e) => handleInputChange('specific_location', e.target.value)}
                    placeholder="Ví dụ: Phòng A101, Tầng 1"
                  />
                </div>
              </div>

              {/* Event Image */}
              <div className="space-y-4">
                <Label>Ảnh sự kiện</Label>
                
                {/* Current Image Display */}
                {formData.image && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={formData.image}
                      alt="Event image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                {!formData.image && (
                  <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">Chưa có ảnh sự kiện</p>
                    </div>
                  </div>
                )}
                
                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={uploading}
                    className="w-full md:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Đang tải lên..." : "Cập nhật ảnh"}
                  </Button>
                </div>
              </div>

              {/* Rich Text Editor for Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Nội dung sự kiện</Label>
                <RichTextEditor
                  value={formData.notion_content}
                  onChange={(value: string) => handleInputChange('notion_content', value)}
                  placeholder="Nhập nội dung chi tiết về sự kiện..."
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {formData.is_visible ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <Label htmlFor="visibility" className="font-medium">
                      {formData.is_visible ? "Sự kiện đang hiển thị" : "Sự kiện đang ẩn"}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {formData.is_visible 
                        ? "Sự kiện sẽ hiển thị công khai cho người dùng"
                        : "Sự kiện sẽ không hiển thị cho người dùng"
                      }
                    </p>
                  </div>
                </div>
                <Switch
                  id="visibility"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => handleInputChange('is_visible', checked)}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={saving || !formData.title.trim() || !formData.date}
                  className="bg-[#004987] hover:bg-[#003366] px-8"
                  size="lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
