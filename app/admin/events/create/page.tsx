"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import Image from "next/image";

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

interface Speaker {
  name: string;
  role: string;
  avatar: string;
  biography: string;
}

interface Schedule {
  title: string;
  description: string;
  date: string;
  time: string;
}

export default function AdminEventCreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    specific_location: "",
    image: "",
    notion_content: "",
    is_visible: true,
    speakers: [] as Speaker[],
    schedules: [] as Schedule[],
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (file: File, field: string) => {
    try {
      setUploading(true);

      const mockImageUrl = URL.createObjectURL(file);
      handleInputChange(field, mockImageUrl);

      toast.success("Ảnh đã được tải lên thành công");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Không thể tải lên ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleAddSpeaker = () => {
    setFormData(prev => ({
      ...prev,
      speakers: [
        ...prev.speakers,
        { name: "", role: "", avatar: "", biography: "" }
      ]
    }));
  };

  const handleDeleteSpeaker = (index: number) => {
    setFormData(prev => ({
      ...prev,
      speakers: prev.speakers.filter((_, i) => i !== index)
    }));
  };

  const handleSpeakerChange = (index: number, field: keyof Speaker, value: any) => {
    const updatedSpeakers = [...formData.speakers];
    updatedSpeakers[index][field] = value;
    handleInputChange("speakers", updatedSpeakers);
  };

  const handleAddSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        { title: "", description: "", date: "", time: "" }
      ]
    }));
  };

  const handleDeleteSchedule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index)
    }));
  };

  const handleScheduleChange = (index: number, field: keyof Schedule, value: any) => {
    const updatedSchedules = [...formData.schedules];
    updatedSchedules[index][field] = value;
    handleInputChange("schedules", updatedSchedules);
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      if (!formData.title.trim()) {
        toast.error("Tên sự kiện là bắt buộc");
        return;
      }

      if (!formData.date) {
        toast.error("Ngày diễn ra là bắt buộc");
        return;
      }

      const newEvent = {
        title: formData.title.trim(),
        date: formData.date,
        time: formData.time || undefined,
        location: formData.location || undefined,
        specific_location: formData.specific_location || undefined,
        image: formData.image || undefined,
        notion_content: formData.notion_content || undefined,
        is_visible: formData.is_visible,
        speakers: formData.speakers,
        schedules: formData.schedules,
      };

      // Call API to create event (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call

      toast.success("Sự kiện đã được tạo thành công");

      setTimeout(() => {
        router.push("/admin/events");
      }, 1500);
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Không thể tạo sự kiện");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạo sự kiện mới</h1>
            <p className="text-gray-600">Điền thông tin để tạo sự kiện mới.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Thông tin sự kiện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tên sự kiện *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Nhập tên sự kiện..."
                  className="text-lg font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Ngày diễn ra *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Thời gian</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Ví dụ: Đại học GTVT"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specific_location">Địa điểm cụ thể</Label>
                  <Input
                    id="specific_location"
                    value={formData.specific_location}
                    onChange={(e) => handleInputChange("specific_location", e.target.value)}
                    placeholder="Ví dụ: Phòng A101, Tầng 1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Ảnh sự kiện</Label>
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
                <div>
                  <input
                    type="file"
                    id="event-image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "image");
                    }}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("event-image-upload")?.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Đang tải lên..." : "Tải ảnh sự kiện"}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Lịch trình</Label>
                {formData.schedules.map((schedule, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label>Tiêu đề</Label>
                      <Input
                        value={schedule.title}
                        onChange={(e) => handleScheduleChange(index, "title", e.target.value)}
                        placeholder="Nhập tiêu đề lịch trình"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mô tả</Label>
                      <Input
                        value={schedule.description}
                        onChange={(e) => handleScheduleChange(index, "description", e.target.value)}
                        placeholder="Nhập mô tả lịch trình"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Ngày</Label>
                        <Input
                          type="date"
                          value={schedule.date}
                          onChange={(e) => handleScheduleChange(index, "date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Thời gian</Label>
                        <Input
                          type="time"
                          value={schedule.time}
                          onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSchedule(index)}
                    >
                      Xóa lịch trình
                    </Button>
                  </div>
                ))}
                <Button onClick={handleAddSchedule} variant="outline">
                  Thêm lịch trình
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung sự kiện</Label>
                <RichTextEditor
                  value={formData.notion_content}
                  onChange={(value: string) => handleInputChange("notion_content", value)}
                  placeholder="Nhập nội dung chi tiết về sự kiện..."
                />
              </div>

              <div className="space-y-4">
                <Label>Diễn giả</Label>
                {formData.speakers.map((speaker, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label>Tên diễn giả</Label>
                      <Input
                        value={speaker.name}
                        onChange={(e) => handleSpeakerChange(index, "name", e.target.value)}
                        placeholder="Nhập tên diễn giả"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Vai trò</Label>
                      <Input
                        value={speaker.role}
                        onChange={(e) => handleSpeakerChange(index, "role", e.target.value)}
                        placeholder="Nhập vai trò của diễn giả"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tiểu sử</Label>
                      <Input
                        value={speaker.biography}
                        onChange={(e) => handleSpeakerChange(index, "biography", e.target.value)}
                        placeholder="Nhập tiểu sử diễn giả"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ảnh đại diện</Label>
                      {speaker.avatar && (
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border border-gray-200">
                          <Image
                            src={speaker.avatar}
                            alt="Speaker avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          id={`speaker-avatar-upload-${index}`}
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, `speakers[${index}].avatar`);
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById(`speaker-avatar-upload-${index}`)?.click()}
                          disabled={uploading}
                        >
                          {uploading ? "Đang tải lên..." : "Tải ảnh đại diện"}
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteSpeaker(index)}
                    >
                      Xóa diễn giả
                    </Button>
                  </div>
                ))}
                <Button onClick={handleAddSpeaker} variant="outline">
                  Thêm diễn giả
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {formData.is_visible ? (
                    <span className="text-green-600">Hiển thị</span>
                  ) : (
                    <span className="text-gray-400">Ẩn</span>
                  )}
                  <Label htmlFor="visibility" className="font-medium">
                    {formData.is_visible ? "Sự kiện đang hiển thị" : "Sự kiện đang ẩn"}
                  </Label>
                </div>
                <Switch
                  id="visibility"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => handleInputChange("is_visible", checked)}
                />
              </div>

              <div className="flex justify-end pt-6 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={saving || !formData.title.trim() || !formData.date}
                  className="bg-[#004987] hover:bg-[#003366] px-8"
                  size="lg"
                >
                  {saving ? "Đang tạo..." : "Tạo sự kiện"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}